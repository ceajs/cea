const conf = require('./init')

const login = require('./crawler/casLogIn')
const log = require('./interface/colorLog')

const { signApp } = require('./campusphere/app')

const school = conf.get('school')
const users = conf.get('users')

if (!users) {
  log.error('未找到用户,请运行 ./init.js -u 配置')
  process.exit(1)
}

/**
 * Keys of this cookie Object:
 * YOU CAN USE THIS COOKIE FOR EVERYTHING
 * @compusphere something about cp daliy's app
 * @swms continuing log into your school's swms [stu work magagement system]
 */
let cookie, storeCookiePath

users.forEach(async i => {
  storeCookiePath = `cookie.${i.alias || i.username}`

  if (!conf.get(storeCookiePath)) {
    await reLogin(i)
  } else {
    storeCookie(storeCookiePath)
  }

  let sign = new signApp(school, cookie)
  const isNeedLogIn = await sign.signInfo()
  if (isNeedLogIn) {
    await reLogin(i)
    sign = new signApp(school, cookie)
    await sign.signInfo()
  }
  await sign.signWithForm()
  process.exit(0)
})

async function reLogin(i) {
  cookie = await login(school, i)
  conf.set(storeCookiePath, cookie)
  log.success('Cookie stored to local storage')
}

function storeCookie(path) {
  cookie = conf.get(path)
  log.success('Using stored cookie')
}
