import { UsersConf, UserConfOpts, SchoolConf } from './types/conf'

import { parse } from '@iarna/toml'
import { prompt } from 'enquirer'
import { resolve } from 'path'
import { AnyObject } from './types/helper'
import { UserAction } from './constants'

import fetch, { Response } from 'node-fetch'
import log from './utils/logger'
import fs from 'fs'

export function loadConfFromToml(): UsersConf | null {
  const path = resolve('./conf.toml')
  if (fs.existsSync(path)) {
    const usersConf = parse(fs.readFileSync(path, 'utf8'))!.users as UsersConf
    return usersConf
  }
  return null
}

export async function promptToGetConf(): Promise<UsersConf | null> {
  const toml = loadConfFromToml()
  const loadedUsers = toml ? toml : []

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
              '学校的英文简称（推荐，仅部分学校支持使用简称）\n其它学校请参阅 https://github.com/beetcb/cea/blob/master/docs/abbrList.sh 寻找简称',
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
      return [...loadedUsers, addUser]
    }
    case UserAction.DELETE: {
      const deleteUserNaire = {
        type: 'select',
        name: 'deleteUser',
        message: '请选择删除用户',
        choices: loadedUsers.map((e) => e.alias),
      }
      const res = (await prompt([deleteUserNaire])) as { deleteUser: string }
      return [...loadedUsers.filter((val) => val.alias !== res.deleteUser)]
    }
    case UserAction.CANCEL: {
      return null
    }
  }
}

export async function getSchoolInfos(
  users: UsersConf
): Promise<SchoolConf | null> {
  let res: Response,
    schoolInfos = {} as SchoolConf
  const schoolNamesSet = new Set(...users.map((e) => e.school))
  for (const abbreviation in schoolNamesSet) {
    res = (await fetch(
      `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${abbreviation}`
    ).catch((err) => log.error(err))) as Response

    const data = JSON.parse(
      (await res.text().catch((err) => log.error(err))) as string
    ).data[0] as AnyObject

    let origin = new URL(data.ampUrl).origin
    const casOrigin = data.idsUrl

    // fall back to ampUrl2 when campusphere not included in the `origin`
    if (!origin.includes('campusphere')) {
      origin = new URL(data.ampUrl2).origin
    }

    schoolInfos[abbreviation] = {
      loginStartEndpoint: `${origin}/iap/login?service=${encodeURIComponent(
        `${origin}/portal/login`
      )}`,
      swms: new URL(casOrigin),
      chineseName: data.name,
      campusphere: new URL(origin),
      isIap: data.joinType !== 'NOTCLOUD',
    }

    log.success({ message: `你的学校 ${data.name} 已完成设定` })
    return schoolInfos
  }
  log.error('未配置学校信息')
  return null
}
