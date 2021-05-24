#!/usr/bin/env node
import {
  sstore,
  UsersConf,
  UserConfOpts,
  getSchoolInfos,
  loadConfFromToml,
} from 'cea-core'
import { UserAction } from './constants'
import { prompt } from 'enquirer'
;(async () => {
  const argv = process.argv[2] || ''
  const argv2 = process.argv[3]

  switch (argv) {
    case 'user': {
      await promptToGetConf()
      break
    }
    case 'rm': {
      if (argv2 === 'all') {
        sstore.clear()
      } else {
        sstore.del(argv2)
      }
      break
    }
    case 'sign': {
      break
    }
    case 'load': {
      loadConfFromToml()
      break
    }

    default: {
      console.log(`
  Usage: cea <command>
  All Commands: 
        user      create|delete user
        school    config your school info
        sign      campusphere check in
        load      load config info from conf.toml
        rm        remove stored config feilds
  `)
      break
    }
  }

  sstore.close()
})()

export async function promptToGetConf(): Promise<void> {
  const loadedUsers = sstore.get('users') as UsersConf

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
      sstore.set('users', [...loadedUsers, addUser])
      break
    }
    case UserAction.DELETE: {
      const deleteUserNaire = {
        type: 'select',
        name: 'deleteUser',
        message: '请选择删除用户',
        choices: loadedUsers.map((e) => e.alias),
      }
      const res = (await prompt([deleteUserNaire])) as { deleteUser: string }
      sstore.set('users', [
        ...loadedUsers.filter((val) => val.alias !== res.deleteUser),
      ])
      break
    }
    case UserAction.CANCEL:
      return
  }
  const schools = await getSchoolInfos(sstore.get('users'))
  sstore.set('schools', schools!)
}
