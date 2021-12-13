#!/usr/bin/env node
import { attendanceCheckIn } from '@ceajs/attendance-plugin'
import { log, sstore, UserConfOpts, UsersConf } from '@ceajs/core'
import { checkIn } from '@ceajs/sign-plugin'
import enquirer from 'enquirer'
import { confSet } from './conf-set.js'
import { UserAction } from './constants.js'
const { prompt } = enquirer
;(async () => {
  const argv = process.argv[2] || ''
  const argv2 = process.argv[3]

  switch (argv) {
    case 'get': {
      if (argv2) {
        console.log(sstore.get(argv2))
      } else {
        console.error('Please specify <schools | users>')
      }
      break
    }
    case 'user': {
      const users = await promptToGetConf()
      if (users) {
        await confSet({ users })
      }
      break
    }
    case 'rm': {
      if (argv2 === 'all') {
        sstore.clear()
      } else if (argv2) {
        sstore.del(argv2)
      } else {
        console.error('Please specify <schools | users | all>')
      }
      break
    }
    case 'sign': {
      await checkIn()
      break
    }
    case 'attendance': {
      await attendanceCheckIn()
      break
    }
    case 'load': {
      await confSet(null, argv2)
      break
    }

    default: {
      console.log(`
  Usage: cea <command>

  All Commands: 
        user        
            interactively create|delete user
        sign      
            sign tasks check in
        attendance  
            attendance tasks check in
        load [path]
            load config info from path, or default to \`./conf.json\`
        rm <schools | users | all>  
            remove stored config feilds
        get <schools | users> 
            display stored config feilds
  `)
      break
    }
  }

  sstore.close()
})()

async function promptToGetConf(): Promise<UsersConf['users'] | null> {
  const loadedUsers = (sstore.get('users') as UsersConf['users']) || []

  const actionNaire = {
    type: 'select',
    name: 'actionType',
    message: `用户编辑(已有用户：${
      loadedUsers.reduce((s, e) => {
        const userInfo = e.alias
        return s + ' ' + userInfo
      }, '')
    })`,
    choices: [
      {
        name: UserAction.CREATE,
        value: UserAction.CREATE,
      },
      {
        name: UserAction.DELETE,
        value: UserAction.DELETE,
      },
      {
        name: UserAction.CANCEL,
        value: UserAction.CANCEL,
      },
    ],
  }
  const { actionType } = (await prompt([actionNaire]).catch((_) => _)) as {
    actionType: UserAction
  }

  switch (actionType) {
    case UserAction.CREATE: {
      const form = {
        type: 'form',
        name: 'addUser',
        message: '请填写如下信息：',
        choices: [
          { name: 'username', message: '用户名', initial: '1913030099' },
          { name: 'password', message: '密码', initial: '081312' },
          {
            name: 'alias',
            message: '用户别名',
            initial: 'foo',
          },
          {
            name: 'school',
            message: '学校简称',
            initial: 'whu',
          },
        ],
      }
      const { addUser } = (await prompt([form]).catch((_) => _)) as {
        addUser: UserConfOpts
      }

      const list = {
        type: 'list',
        name: 'addr',
        message: '签到地址',
        initial: [''],
      }
      const { addr } = (await prompt([list]).catch((_) => _)) as {
        addr: [string, string, string]
      }
      addUser.addr = addr
      if (!loadedUsers.some((e) => e.alias === addUser.alias)) {
        log.success({ message: '成功加载用户', suffix: `@${addUser.alias}` })
        return Array.from(new Set([...loadedUsers, addUser]))
      } else {
        log.error({ message: '用户已存在' })
        return null
      }
    }
    case UserAction.DELETE: {
      if (loadedUsers.length === 0) {
        log.error({ message: '无用户可删除' })
        return null
      }
      const deleteUserNaire = {
        type: 'select',
        name: 'deleteUser',
        message: '请选择删除用户',
        choices: loadedUsers.map((e) => e.alias),
      }
      const res = (await prompt([deleteUserNaire]).catch((_) => _)) as {
        deleteUser: string
      }
      return [...loadedUsers.filter((val) => val.alias !== res.deleteUser)]
    }
    default:
      return null
  }
}
