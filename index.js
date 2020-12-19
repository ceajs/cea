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
log.object(users)

/**
 * Keys of this cookie Object:
 * YOU CAN USE THIS COOKIE FOR EVERYTHING
 * @compusphere something about cp daliy's app
 * @swms continuing log into your school's swms [stu work magagement system]
 */
let cookie
let storeCookiePath, sign

/* get/store/update cookie synchronizedly */
async function handleCookie() {
  for (let i of users) {
    storeCookiePath = `cookie.${i.alias || i.username}`

    if (!conf.get(storeCookiePath)) {
      await reLogin(i)
    } else {
      storeCookie(storeCookiePath, i)
    }
    sign = new signApp(school, cookie, i)
    const isNeedLogIn = await sign.signInfo()
    if (isNeedLogIn) {
      await reLogin(i)
      try {
        cookie.campusphere
      } catch (err) {
        log.error(`${name}: exit(1)`)
      }
    }
  }
}

/* sign in asynchronizedly */
async function signIn(i) {
  sign = new signApp(school, cookie, i)
  await sign.signInfo()
  await sign.signWithForm()
}

;(async () => {
  await handleCookie()

  // start to sign
  for (let i of users) {
    await signIn(i)
  }
})()

async function reLogin(i) {
  const name = i.alias || i.username

  if (!i.cookie) {
    cookie = await login(school, i)
    if (cookie) {
      conf.set(storeCookiePath, cookie)
      log.success(`${name}: Cookie stored to local storage`)
    }
  } else {
    cookie = { campusphere: i.cookie }
    log.success(`${name}: Using user provided cookie`)
  }
}

function storeCookie(path, i) {
  const name = i.alias || i.username
  cookie = conf.get(path)
  log.success(`${name}: Using stored cookie`)
}
