import { UsersConf, UserConfOpts, SchoolConf } from './types/conf'

import { parse } from '@iarna/toml'
import { prompt } from 'enquirer'
import { resolve } from 'path'
import { StringKV } from './types/helper'
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

export async function promptToGetConf(
  users: Array<UserConfOpts>
): Promise<UsersConf | null> {
  const loadedUsers = users ? users : []

  const actionNaire = {
    type: 'select',
    name: 'actionType',
    message: `用户编辑(已有用户：${loadedUsers.reduce((s, e) => {
      const userInfo = e.alias
      return s + ' ' + userInfo
    }, '')})`,
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
  const { actionType } = (await prompt([actionNaire])) as {
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
          {
            name: 'addr',
            message: '签到地址',
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
    defaultAddr: string,
    schoolInfos = {} as SchoolConf
  const schoolNamesSet = new Set(users.map((e) => e.school))
  const isSchoolAddrNeeded = users.find((e) => e.addr.length === 1)
  for (const abbreviation of schoolNamesSet) {
    res = (await fetch(
      `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${abbreviation}`
    ).catch((err) => log.error(err))) as Response

    const data = JSON.parse(
      (await res.text().catch((err) => log.error(err))) as string
    ).data[0] as StringKV

    let origin = new URL(data.ampUrl).origin
    const casOrigin = data.idsUrl

    // fall back to ampUrl2 when campusphere not included in the `origin`
    if (!origin.includes('campusphere')) {
      origin = new URL(data.ampUrl2).origin
    }

    res = (await fetch(
      `https://api.map.baidu.com/?qt=s&wd=${encodeURIComponent(
        data.name
      )}&ak=E4805d16520de693a3fe707cdc962045&rn=10&ie=utf-8&oue=1&fromproduct=jsapi&res=api`
    ).catch((err) => log.error(err))) as Response
    const addrInfo = await res.json()
    defaultAddr = addrInfo.content[0].addr

    schoolInfos[abbreviation] = {
      defaultAddr,
      loginStartEndpoint: `${origin}/iap/login?service=${encodeURIComponent(
        `${origin}/portal/login`
      )}`,
      swms: casOrigin,
      chineseName: data.name,
      campusphere: origin,
      isIap: data.joinType !== 'NOTCLOUD',
    }

    log.success({ message: `学校 ${data.name} 已完成设定` })
  }
  return schoolInfos
}
