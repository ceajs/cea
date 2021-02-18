// Reset $XDG_CONFIG_HOME
process.env.XDG_CONFIG_HOME = '/tmp'
const { handleCookie, signApp, conf } = require('../index')

async function signIn() {
  const logs = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    conf.get('users').map(i => {
      return async () => {
        const cookie = i.cookie
          ? { campusphere: i.cookie }
          : conf.get(`cookie.${i.alias}`)
        const sign = new signApp(conf.get('school'), i)
        const isInvalid = await sign.signInfo(cookie)
        // If cookie is invalid, we sign in
        if (!isInvalid) {
          await sign.signWithForm()
        } else {
          logs[i.alias] = sign.result
        }
      }
    })
  )
  return logs
}

async function handler() {
  // load config from toml or env
  await conf.init()
  // Log in and save cookie to conf, using conf.get('cookie') to get them
  await handleCookie()
  // Sign in
  // const logs = await signIn()
  // Log out config path
  // console.table(logs)
}

exports.main = handler
handler()
