const Conf = require('conf')
const log = require('../interface/colorLog')
const login = require('../crawler/casLogIn')
const { signApp } = require('../campusphere/app')

const conf = new Conf()

// get|store|update cookie synchronizedly, prevent concurrent overlap writes to conf
conf.handleCookie = async () => {
  // Return users with curTask
  const usersWithTask = []
  for (const i of conf.get('users')) {
    const storeCookiePath = `cookie.${i.alias}`
    i.sign = await handleLogin(i, storeCookiePath)
    usersWithTask.push(i)
  }
  return usersWithTask
}

async function handleLogin(i, storeCookiePath) {
  /**
   * Keys of this cookie object:
   * @compusphere something about cp daliy's app
   * @swms continuing log into your school's swms [stu work magagement system]
   */
  let cookie = conf.get(storeCookiePath)
  const name = i.alias

  // Check if the cookie is stored, if not, login in to eat them
  if (!cookie) {
    cookie = await login(conf.get('school'), i)
    if (cookie) {
      conf.set(storeCookiePath, cookie)
      log.success(`用户${name}: 已成功获取并缓存 Cookie`)
    }
  }
  const sign = new signApp(conf.get('school'), i)
  // Check if the cookie is eligible, if not, reLogin 1 more time
  const isNeedLogIn = await sign.signInfo(cookie)
  if (isNeedLogIn) {
    cookie = await login(conf.get('school'), i)
    if (cookie) {
      conf.set(storeCookiePath, cookie)
      log.success(`用户${name}: 已成功刷新并缓存 Cookie`)
    }
  } else {
    log.success(`用户${name}: 尝试使用缓存中的 Cookie`)
  }

  // Return sign instance, cause we already have cur task in our hand
  return sign
}

module.exports = conf
