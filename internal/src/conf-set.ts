import { getSchoolInfos, loadConfFromToml, sstore } from 'cea-core'
import type { UsersConf } from 'cea-core'

export async function confSet(users: UsersConf | null = loadConfFromToml()) {
  if (users) {
    const schoolConf = await getSchoolInfos(users)
    if (schoolConf) {
      sstore.set('schools', schoolConf)
    }
    sstore.set('users', users)
  }
}
