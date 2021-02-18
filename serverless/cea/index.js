// Reset $XDG_CONFIG_HOME
process.env.XDG_CONFIG_HOME = '/tmp'
const { conf, signApp } = require('@beetcb/cea')

async function signIn() {
  const logs = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    conf.get('users').map(async i => {
      const cookie = conf.get(`cookie.${i.alias}`)
      const sign = new signApp(conf.get('school'), i)
      await sign.signInfo(cookie)
      await sign.signWithForm()
      logs[i.alias || i.id] = sign.result
    })
  )
  return logs
}

async function handler() {
  // load config from toml or env
  await conf.load()
  // Log in and save cookie to conf, using conf.get('cookie') to get them
  await conf.handleCookie()
  // Sign in
  const logs = await signIn()
  // Log out config path
  console.table(logs)
}

exports.main = handler