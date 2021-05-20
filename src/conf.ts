import { UsersConf, UserConfOpts } from './types/conf'
import { UserAction } from './constants'

import { parse } from '@iarna/toml'
import { prompt } from 'enquirer'
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

export function loadConfFromEnv({
  users,
}: {
  users: string
}): UsersConf | null {
  if (users) {
    const loadedUsers = users.split('\n').map((user) => {
      let addr: string | Array<string> = user.split('home ')[1]
      addr = addr ? addr.split(' ') : ['']

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
  } else {
    return null
  }
}

export async function promptToGetConf(): Promise<UsersConf | null> {
  const toml = loadConfFromToml()
  const loadedUsers = toml ? toml.users : []

  const actionNaire = {
    type: 'list',
    name: 'actionType',
    message: `用户编辑(已有用户：${loadedUsers.reduce((s, e) => {
      const userInfo = e.alias
      return s + ' ' + userInfo
    }, '')})`,
    choices: [
      {
        name: UserAction.CREATE,
      },
      {
        name: UserAction.DELETE,
      },
      {
        name: UserAction.CANCEL,
      },
    ],
  }
  const { actionType } = (await prompt([actionNaire])) as {
    actionType: UserAction
  }

  switch (actionType) {
    case UserAction.CREATE: {
      const form = {
        type: 'form',
        name: 'addUser',
        message: 'Please provide the following information:',
        choices: [
          { name: 'username', message: '请输入用户名', initial: '1913030099' },
          { name: 'password', message: '请输入密码', initial: '081312' },
          {
            name: 'alias',
            message: '请输入用户别名',
            initial: 'foo',
          },
          {
            name: 'school',
            message:
              '学校的英文简称（推荐，仅部分学校支持使用简称）\n请参阅 https://github.com/beetcb/cea/blob/master/docs/abbrList.sh 自行判断\n或中文全称（备用选项，所有学校均支持）:',
            initial: 'whu',
          },
          {
            name: 'addr',
            message:
              '签到地址数组，留空使用学校地址签到，自定义签到地址：经度, 纬度, 中文地址',
            initial: '',
          },
        ],
      }
      const { addUser } = (await prompt([form])) as { addUser: UserConfOpts }
      return { users: [...loadedUsers, addUser] }
    }
    case UserAction.DELETE: {
      const deleteUserNaire = {
        type: 'select',
        name: 'deleteUser',
        message: '请选择删除用户',
        choices: loadedUsers.map((e) => e.alias),
      }
      const res = (await prompt([deleteUserNaire])) as { deleteUser: string }
      return {
        users: [...loadedUsers.filter((val) => val.alias !== res.deleteUser)],
      }
    }
    case UserAction.CANCEL: {
      return null
    }
  }
}
