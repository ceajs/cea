#!/usr/bin/env node
const Conf = require('conf')
const fetch = require('node-fetch')
const yaml = require('js-yaml')
const fs = require('fs')
const log = require('./interface/colorLog')
const { prompt } = require('inquirer')
const conf = new Conf()
module.exports = conf

class User {
  constructor(config) {
    this.conf = config
    this.selectType = null
  }

  storeUsers(loadedUsers) {
    const users = this.conf.get('users') || []
    const storedUsers = users.map(e => e.username)
    loadedUsers = loadedUsers.filter(e => !storedUsers.includes(e.username))
    this.conf.set('users', [...loadedUsers, ...users])
  }

  loadUserFromFile(path) {
    let loadedUsers
    if (fs.existsSync(path)) {
      const doc = yaml.load(fs.readFileSync(path, 'utf8'))
      if (!doc) return
      loadedUsers = doc
    } else {
      return
    }
    this.storeUsers(loadedUsers)
  }

  loadUserFromEnv({ users }) {
    if (users) {
      const loadedUsers = users.split('\n').map(user => {
        const [username, password, alias] = user.split(' ')
        let addr = user.split('home ')[1]
        addr = addr ? addr.split(' ') : null
        return { username, password, alias, addr }
      })
      this.storeUsers(loadedUsers)
    }
  }

  async load() {
    const users = this.conf.get('users') || []
    const questions = [
      {
        type: 'list',
        name: 'type',
        message: `用户编辑: ${
          conf.get('school') ? ' 学校信息已成功配置' : ' 学校信息未配置'
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
    if (!conf.get('school')) {
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
      const school = await this.schoolApi(res.ids, isSignAtHome)

      if (!isSignAtHome) school.addr = await this.schoolAddr(school.name)
      this.conf.set('school', school)
      log.success(`您的学校 ${school.name} 已完成设定`)
    } else {
      log.warning('学校信息已配置')
    }
  }

  /**
   * Grab school info from environment
   * @param {string} name school
   */
  async loadSchoolFromEnv({ school: name, users }) {
    if (!conf.get('school')) {
      const isSignAtHome = users.includes('home')
      const school = await this.schoolApi(name, isSignAtHome)
      if (!isSignAtHome) school.addr = await this.schoolAddr(name)
      this.conf.set('school', school)
      log.success(`您的学校 ${school.name} 已完成设定`)
    } else {
      log.warning('学校信息已配置')
    }
  }

  /**
   * Get school address & coordinates(with baidu website's ak)
   * @param {string} name school
   */
  async schoolAddr(name) {
    let res = await fetch(
      `https://api.map.baidu.com/?qt=s&wd=${encodeURIComponent(
        name
      )}&ak=E4805d16520de693a3fe707cdc962045&rn=10&ie=utf-8&oue=1&fromproduct=jsapi&res=api`
    )
    res = await res.json()
    const { addr } = res.content[0]
    return addr
  }

  /**
   * Grab school endpoint from campushoy API
   * @param {string} name school name
   * @param {boolean} isSignAtHome
   */
  async schoolApi(name, isSignAtHome) {
    let res = await fetch(
      `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${name}`
    ).catch(err => err)
    res = await JSON.parse(await res.text())

    const origin = new URL(res.data[0].ampUrl).origin
    const casOrigin = res.data[0].idsUrl
    const schoolName = res.data[0].name
    return {
      name: schoolName,
      casOrigin,
      origin,
      isSignAtHome,
      login: `${casOrigin}/login?service=${encodeURIComponent(
        origin
      )}/portal/login`,
      campusphere: `${origin}/portal/login`,
      checkCaptcha: `${casOrigin}/checkNeedCaptcha.htl`,
      getCaptcha: `${casOrigin}/getCaptcha.htl`,
    }
  }
}

;(async () => {
  const argv = process.argv[2] || ''
  const argv2 = process.argv[3]

  switch (argv) {
    case '-u':
    case '--user': {
      const userUlti = new User(conf)
      userUlti.loadUserFromFile('./userConf.yml')
      userUlti.loadUserFromEnv(process.env)
      await userUlti.load()
      const type = userUlti.selectType
      if (type === 1) userUlti.createUser()
      if (type === 2) userUlti.deleteUser()
      break
    }
    case '-s':
    case '--school': {
      new School(conf).init()
      break
    }
    case 'rm':
    case '--remove': {
      if (argv2 === 'all') conf.clear()
      conf.delete(argv2)
      break
    }
    case 'sign': {
      require('./TEST/dcampus')
      break
    }
    default: {
      const env = process.env
      if (env.users && env.school) {
        log.warning('Loading from env!')
        const userUlti = new User(conf)
        userUlti.loadUserFromEnv(env)
        await new School(conf).loadSchoolFromEnv(env)
        require('./TEST/dcampus')
      }
    }
  }
})()
