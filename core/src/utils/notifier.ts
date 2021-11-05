import { EOL } from 'node:os'

const notifications: Array<string> = []

const saveNotifications = (args: Array<any>) => {
  const message = args[0]
  const log = message?.message ?? message
  notifications.push(log)
}

const notify = async function() {
  const content = notifications.join(EOL)
  // return pushAPI()
  throw 'Not implemented'
}

export { notify, saveNotifications }
