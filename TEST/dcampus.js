const { handleCookie, conf } = require('../index')
const { signApp } = require('../campusphere/app')

// Grab users array
const users = conf.get('users')
// Grab school info
const school = conf.get('school')

;(async () => {
  // Log in and save cookie to conf, using conf.get('cookie') to get them
  await handleCookie()
  // wait * minute for signing
  await sleep(0)
  // Sign in
  const logs = await signIn()
  // Log out config path
  console.table(logs)
})()

async function sleep(timeout) {
  return new Promise(r => setTimeout(r, timeout * 1000 * 60))
}

async function signIn() {
  const logs = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    users.map(async i => {
      const cookie = i.cookie
        ? { campusphere: i.cookie }
        : conf.get(`cookie.${i.alias || i.username}`)
      const sign = new signApp(school, i)
      await sign.signInfo(cookie)
      await sign.signWithForm()
      logs[i.alias || i.id] = sign.result
    })
  )
  return logs
}
