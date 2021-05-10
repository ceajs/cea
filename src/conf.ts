import { UsersConf, UserConfOpts } from '../types/conf'

import { parse } from '@iarna/toml'
import { resolve } from 'path'
import fs from 'fs'

export function loadConfFromToml(): UsersConf | null {
  const path = resolve('./conf.toml')
  if (fs.existsSync(path)) {
    const usersConf = parse(fs.readFileSync(path, 'utf8')) as UsersConf
    return usersConf
  }
  return null
}

export function loadConfFromEnv({ users }: { users: string }): UsersConf {
  const loadedUsers = users.split('\n').map((user) => {
    let addr: string | Array<string> = user.split('home ')[1]
    addr = addr ? addr.split(' ') : ''

    const [school, username, password, alias] = user.split(' ')
    const userConfOpts: UserConfOpts = {
      school,
      username,
      password,
      alias,
      addr,
    }
    return userConfOpts
  })
  return { users: loadedUsers }
}

