const cea = require('@beetcb/cea')

async function signIn(usersWithTask) {
  const logs = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    usersWithTask.map(async (i) => {
      await i.sign.signWithForm()
      logs[i.alias || i.id] = i.sign.result
      // Fix circular object
      delete i.sign
    })
  )
  return logs
}

async function handler(event) {
  // load config from toml or env only when we testing
  if (!(event.Type === 'Timer')) {
    // When testing, we need to get the lastest info
    cea.clear()
    await cea.init()
  }
  // Log in and save cookie to cea, using cea.get('cookie') to get them (this function resolve with an users array)
  const usersWithTask = await cea.handleCookie()
  // Sign in
  const logs = await signIn(usersWithTask)
  // Log out sign in result
  console.table(logs)
  cea.close()
}

exports.main = handler
