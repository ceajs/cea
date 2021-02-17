// Reset $XDG_CONFIG_HOME
process.env.XDG_CONFIG_HOME = '/tmp'
const { handleCookie, signApp, conf } = require('@beetcb/cea')

// Grab users array
const users = conf.get('users')
// Grab school info
const school = conf.get('school')

function loadConf() {
  const path = './conf.toml'
  if (fs.existsSync(path)) {
    const doc = tomlParse(fs.readFileSync(path, 'utf8'))
    if (!conf.get('school')) 
    return doc.users
  }
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

async function handler() {
  // Log in and save cookie to conf, using conf.get('cookie') to get them
  await handleCookie()
  // Sign in
  const logs = await signIn()
  // Log out config path
  console.table(logs)
}

exports.main = handler
