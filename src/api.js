const conf = require('./cookie')
const log = require('../interface/colorLog')
const fs = require('fs')
const fetch = require('node-fetch')
const { prompt } = require('inquirer')

const parseToml = require('@iarna/toml/parse-string')

function loadConfFromToml(path) {
  if (fs.existsSync(path)) {
    const doc = parseToml(fs.readFileSync(path, 'utf8'))
    if (doc) return doc
  }
}

// Useful when we init users/shchool from file/env
conf.init = async function () {
  const env = process.env
  const toml = loadConfFromToml('./conf.toml')
  const userUlti = new User()
  const schoolUlti = new School()

  if (env.users && env.school) {
    log.warning('尝试从环境变量加载配置')
    const users = userUlti.loadUserFromEnv(env)
    await schoolUlti.loadSchoolFromEnv(env, users)
  } else if (toml) {
    log.warning('尝试从配置文件加载配置')
    userUlti.loadUserFromToml(toml)
    await schoolUlti.loadSchoolFromToml(toml)
  }
}

class User {
  constructor() {
    this.initConf()
    this.selectType = null
  }

  initConf() {
    if (!conf.get('users')) conf.set('users', [])
  }

  storeUsers(loadedUsers) {
    const storedUsers = conf.get('users')
    const alias = storedUsers.map(e => e.alias)
    if (loadedUsers) {
      loadedUsers = loadedUsers.filter(e => !alias.includes(e.alias))
    } else {
      loadedUsers = []
    }
    conf.set('users', [...loadedUsers, ...storedUsers])
  }

  loadUserFromToml(toml) {
    this.storeUsers(toml.users)
    console.warn(
      `用户${toml.users.reduce(
        (acc, user) => `${acc}${user.alias} `,
        ' '
      )}已加载`
    )
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
      console.warn(
        `用户${loadedUsers.reduce(
          (acc, user) => `${acc}${user.alias} `,
          ' '
        )}已加载`
      )
      return loadedUsers
    }
  }

  async load() {
    const questions = [
      {
        type: 'list',
        name: 'type',
        message: `用户编辑: ${
          conf.get('school') ? ' 学校信息已成功配置' : ' 学校信息未配置'
        }\n  已有用户：${conf.get('users').reduce((s, e) => {
          const userInfo = e.alias
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

    if (!conf.get('users').some(e => e.alias === res.alias)) {
      const addUser = {
        username: res.username,
        password: res.password,
        alias: res.alias || null,
        cookie: res.cookie,
      }
      conf.set('users', [addUser, ...conf.get('users')])
      log.success('🎉 成功添加用户', addUser)
    } else {
      log.error('🙃 用户已存在')
    }
  }

  async deleteUser() {
    const questions = [
      {
        type: 'list',
        name: 'selection',
        message: '请选择删除对象:',
        choices: [
          ...get('users').map((e, idx) => ({
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
    const neoUsers = conf
      .get('users')
      .filter((el, index) => index !== res.selection)
    conf.set('users', neoUsers)

    log.success('🎉 成功删除用户')
  }
}

class School {
  async init() {
    if (!conf.get('school')) {
      const questions = [
        {
          type: 'input',
          name: 'ids',
          message: '请输入学校英文简称',
        },
      ]

      let res = await prompt(questions)
      const school = await this.schoolApi(res.id)

      school.addr = await this.schoolAddr(school.name)
      conf.set('school', school)
      log.success(`您的学校 ${school.name} 已完成设定`)
    } else {
      log.warning('学校信息已配置')
    }
  }

  async loadSchoolFromToml(toml) {
    if (!conf.get('school')) {
      const school = await this.schoolApi(toml.school)
      if (toml.users.some(e => e.addr === ''))
        school.addr = await this.schoolAddr(school.name)
      conf.set('school', school)
      log.success(`你的学校 ${school.name} 已完成设定`)
    }
  }

  /**
   * Grab school info from environment
   * @param {string} name school nmae, english abbreviation
   * @param {array} users list of loaded users
   */
  async loadSchoolFromEnv({ school: name }, users) {
    if (!conf.get('school')) {
      const school = await this.schoolApi(name)
      if (users.some(e => e.addr === ''))
        school.addr = await this.schoolAddr(school.name)
      conf.set('school', school)
      log.success(`你的学校已完成设定`)
    } else {
      log.warning('学校信息已配置')
    }
  }

  /**
   * Get school address & coordinates(with baidu website's ak)
   * @param {string} name school name, english abbreviation
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
   * @param {string} name school name, english abbreviation
   */
  async schoolApi(name) {
    let res = await fetch(
      `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${name}`
    ).catch(err => err)
    res = await JSON.parse(await res.text())

    const origin = new URL(res.data[0].ampUrl).origin
    const schoolName = res.data[0].name

    let casOrigin = res.data[0].idsUrl
    // Proxy the host who blocks foreign ip access
    if (process.env.GITHUB_ACTION && name === 'whpu') {
      casOrigin = 'https://lean.beetcb.com/authserver'
      console.warn('尝试使用代理访问学校登录页面')
    }

    return {
      name: schoolName,
      casOrigin,
      origin,
      login: `${casOrigin}/login?service=${encodeURIComponent(
        origin
      )}/portal/login`,
      campusphere: `${origin}/portal/login`,
      checkCaptcha: `${casOrigin}/checkNeedCaptcha.htl`,
      getCaptcha: `${casOrigin}/getCaptcha.htl`,
    }
  }
}

module.exports = { conf, User, School }
