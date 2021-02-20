const cea = require('../src/index')

;(async () => {
  // Log in and save cookie to cea, using cea.get('cookie') to get them (this function resolve with an users array)
  const usersWithTask = await cea.handleCookie()
  // Sign in
  const logs = await signIn(usersWithTask)
  // Log out sign in result
  console.table(logs)
})()

async function signIn(usersWithTask) {
  const logs = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    usersWithTask.map(async i => {
      await i.sign.signWithForm()
      logs[i.alias || i.id] = i.sign.result
    })
  )
  return logs
}
