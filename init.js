#!/usr/bin/env node
const Conf = require('conf')
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const log = require('./interface/colorLog')
const { prompt } = require('inquirer')
const conf = new Conf()
module.exports = conf

let school = conf.get('school')

class User {
  constructor(config) {
    this.conf = config
    this.selectType = null
  }

  loadUserFormFile(path) {
    let users = this.conf.get('users') || []
    let loadedUsers
    if (fs.existsSync(path)) {
      const doc = yaml.load(fs.readFileSync(path, 'utf8'))
      if (!doc) return
      loadedUsers = doc
    } else {
      return
    }

    // check duplicates
    const storedUsers = users.map(e => e.username)
    loadedUsers = loadedUsers.filter(e => !storedUsers.includes(e.username))

    this.conf.set('users', [...loadedUsers, ...users])
  }

  async load() {
    const users = this.conf.get('users') || []
    const questions = [
      {
        type: 'list',
        name: 'type',
        message: `用户编辑: ${
          school ? ' 学校信息已成功配置' : ' 学校信息未配置'
        }\n  已有用户：${users.reduce((s, e) => {
          const userInfo = e.alias || e.username
          return s + ' ' + userInfo
        }, '')}`,
        choices: [
          {
            value: 1,
            name: '添加用户',
          },
          {
            value: 2,
            name: '删除用户',
          },
          {
            value: -1,
            name: '取消',
          },
        ],
      },
    ]

    const res = await prompt(questions)
    this.selectType = res.type
  }

  async createUser() {
    const users = this.conf.get('users') || []
    const questions = [
      {
        type: 'input',
        name: 'username',
        message: '请输入用户名',
      },
      {
        type: 'input',
        name: 'password',
        message: '请输入密码',
      },
      {
        type: 'input',
        name: 'alias',
        message: '(可选)请输入用户别名',
      },
      {
        type: 'input',
        name: 'cookie',
        message: '(可选,将省去登录操作)抓包到的 Cookie',
      },
    ]

    const res = await prompt(questions)

    if (!users.some(e => e.username === res.username)) {
      const addUser = {
        username: res.username,
        password: res.password,
        alias: res.alias || null,
        cookie: res.cookie,
      }
      this.conf.set('users', [addUser, ...users])
      log.success('🎉 成功添加用户', addUser)
    } else {
      log.error('🙃 用户已存在')
    }
  }

  async deleteUser() {
    const users = this.conf.get('users')
    const questions = [
      {
        type: 'list',
        name: 'selection',
        message: '请选择删除对象:',
        choices: [
          ...users.map((e, idx) => ({
            value: idx,
            name: `${e.alias || e.user.name}`,
          })),
          {
            value: -1,
            name: '取消',
          },
        ],
      },
    ]

    const res = await prompt(questions)
    const neoUsers = users.filter((el, index) => index !== res.selection)
    this.conf.set('users', neoUsers)

    log.success('🎉 成功删除用户')
  }
}

class School {
  constructor(conf) {
    this.conf = conf
  }

  async init() {
    if (!school) {
      this.conf.set('school', {})
      const questions = [
        {
          type: 'input',
          name: 'ids',
          message: '请输入学校英文简称',
        },
        {
          type: 'list',
          name: 'isSignAtHome',
          message: '是否在家签到(若是,会避开学校随机选点)',
          choices: [
            {
              value: 1,
              name: '是',
            },
            {
              value: 0,
              name: '否',
            },
          ],
        },
      ]

      let res = await prompt(questions)
      const isSignAtHome = res.isSignAtHome
      res = await fetch(
        `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${res.ids}`
      ).catch(err => err)

      res = await JSON.parse(await res.text())

      const origin = new URL(res.data[0].ampUrl).origin
      school = {
        origin,
        isSignAtHome,
        login: `${res.data[0].idsUrl}/login?service=${encodeURIComponent(
          origin
        )}/portal/login`,
        campusphere: `${origin}/portal/login`,
        checkCaptcha: `${res.data[0].idsUrl}/checkNeedCaptcha.htl`,
        getCaptcha: `${res.data[0].idsUrl}/getCaptcha.htl`,
      }

      const schoolName = res.data[0].name

      if (!isSignAtHome) {
        // get school address & coordinates(with baidu website's ak)
        res = await fetch(
          `https://api.map.baidu.com/?qt=s&wd=${encodeURIComponent(
            schoolName
          )}&ak=E4805d16520de693a3fe707cdc962045&rn=10&ie=utf-8&oue=1&fromproduct=jsapi&res=api`
        )
        res = await res.json()
        const { addr } = res.content[0]
        school.addr = addr
      }

      this.conf.set('school', school)
      log.success(
        `您的学校 ${schoolName} 已完成设定, 全局签到地址为：${
          school.addr ? school.addr : 'RANDOM'
        }`
      )
    } else {
      log.warning('学校信息已配置')
    }
    return school
  }
}

;(async (argv = '') => {
  argv = process.argv[2] || ''
  if (argv.match(/(-u|--user)/)) {
    const userUlti = new User(conf)
    userUlti.loadUserFormFile('./userConf.yml')
    await userUlti.load()
    const type = userUlti.selectType
    if (type === 1) userUlti.createUser()
    if (type === 2) userUlti.deleteUser()
  } else if (argv.match(/(-s|--school)/)) {
    school = new School(conf).init()
  } else if (argv.match(/(rm|--remove)/)) {
    const argv2 = process.argv[3]
    if (argv2 === 'all') conf.clear()
    conf.delete(argv2)
  } else if (argv === 'sign') {
    require('./TEST/dcampus')
  }
})()
