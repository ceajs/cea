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
let cookie

// purely for handleCookie func
let storeCookiePath, sign

/* get|store|update cookie synchronizedly */
async function handleCookie() {
  for (let i of users) {
    storeCookiePath = `cookie.${i.alias || i.username}`
    await handleLogin(i, conf.get(storeCookiePath))
  }
}

async function handleLogin(i, storedCookie) {
  const name = i.alias || i.username

  // Check if the cookie is user-provided
  if (!i.cookie) {
    // Check if the cookie is stored
    if (!storedCookie) {
      cookie = await login(school, i)
      storeCookie(storeCookiePath, i, cookie)
    } else {
      storeCookie(storeCookiePath, i)
    }

    // Check if the cookie is eligible, if not, reLogin 1 more time
    sign = new signApp(school, i)
    const isNeedLogIn = await sign.signInfo(cookie)
    if (isNeedLogIn) {
      log.warning(`${name}: cookie is not eligible, reLogin`)
      cookie = await login(school, i)
      storeCookie(storeCookiePath, i, cookie)
    }
  } else {
    log.success(`${name}: Using user provided cookie`)
  }
}

async function signIn(i) {
  const cookie = i.cookie
    ? { campusphere: i.cookie }
    : conf.get(`cookie.${i.alias || i.username}`)
  const sign = new signApp(school, i)
  await sign.signInfo(cookie)
  await sign.signWithForm()
}

function storeCookie(path, i, set) {
  const name = i.alias || i.username
  if (set) {
    conf.set(storeCookiePath, set)
    log.success(`${name}: Cookie stored to local storage`)
  } else {
    cookie = conf.get(path)
    log.success(`${name}: Using stored cookie`)
  }
}

async function sleep(timeout) {
  return new Promise(r => setTimeout(r, timeout * 1000 * 60))
}

;(async () => {
  // Pre-loading cookie for sign in
  await handleCookie()
  // wait 1 minute for signing
  await sleep(1)

  // sign in asynchronizedly with promise all and diff instance of signApp class
  Promise.all(users.map(e => signIn(e)))
})()
