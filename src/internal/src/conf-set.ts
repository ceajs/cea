import { getSchoolInfos, loadConfFromToml, sstore } from '@ceajs/core'
import type { UsersConf } from '@ceajs/core'

export async function confSet(usersConf?: UsersConf | null, path?: string) {
  if (!usersConf) {
    usersConf = loadConfFromToml(path)
  }
  if (usersConf) {
    const { users, notifier } = usersConf
    const schoolConf = await getSchoolInfos(usersConf)
    if (schoolConf) {
      sstore.set('schools', schoolConf)
    }
    if (notifier) {
      sstore.set('notifier', notifier)
    }
    sstore.set('users', users)
  }
}
