import fs from 'node:fs'
import { resolve } from 'node:path'

import * as toml from '@iarna/toml'
import fetch from 'node-fetch'
import log from './utils/logger.js'
const { parse } = toml

import type { Response } from 'node-fetch'
import type { SchoolConf, UsersConf } from './types/conf'
import type { SchoolEdgeCase } from './types/edge-case'
import type { StringKV } from './types/helper'

export function loadConfFromToml(): UsersConf | null {
  const path = resolve('./conf.toml')
  if (fs.existsSync(path)) {
    const usersConf = parse(fs.readFileSync(path, 'utf8')) as UsersConf
    log.success({
      message: '成功加载用户',
      suffix: `${usersConf.users.map((u) => `@${u.alias}`).join(' ')}`,
    })
    return usersConf
  }
  return null
}

export async function getSchoolInfos({
  users,
}: UsersConf): Promise<SchoolConf | null> {
  let res: Response,
    defaultAddr = '',
    schoolInfos = {} as SchoolConf
  const schoolNamesSet = new Set(users.map((e) => e.school))
  const isSchoolAddrNeeded = users.find((e) => e.addr.length === 1)
  for (const abbreviation of schoolNamesSet) {
    res = (await fetch(
      `https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${abbreviation}`,
    ).catch(log.error)) as Response

    const data = (await res.json().catch(log.error)).data?.[0] as StringKV
    if (!data) {
      log.error(`学校 ID 有误，请使用 https://cea.beetcb.com/ 检查学校 ID`)
      return null
    }
    let origin = new URL(data.ampUrl).origin
    const authOrigin = data.idsUrl

    // fall back to ampUrl2 when campusphere not included in the `origin`
    if (!origin.includes('campusphere')) {
      origin = new URL(data.ampUrl2).origin
    }
    if (isSchoolAddrNeeded) {
      res = (await fetch(
        `https://api.map.baidu.com/?qt=s&wd=${
          encodeURIComponent(
            data.name,
          )
        }&ak=E4805d16520de693a3fe707cdc962045&rn=10&ie=utf-8&oue=1&fromproduct=jsapi&res=api`,
      ).catch(log.error)) as Response
      const addrInfo = (await res.json()) as {
        content: Array<{ addr: string; blinfo?: Array<string> }>
      }
      defaultAddr = addrInfo?.content?.find((c) => !c.blinfo)?.addr ?? ''
      log.success({ message: `学校 ${data.name} 默认签到地址：${defaultAddr}` })
    }
    const isCloud = data.joinType === 'CLOUD'

    // Get Edge-cases
    const edgeCaseRes = await fetch(
      `https://cea.beetcb.com/api/edge-case?name=${
        encodeURIComponent(
          data.name,
        )
      }&c=${isCloud ? 'true' : ''}`,
    ).catch(log.error)
    if (edgeCaseRes?.ok) {
      const edgeCase = (await edgeCaseRes.json()) as SchoolEdgeCase
      schoolInfos[abbreviation] = {
        defaultAddr,
        preAuthURL: `${origin}/portal/login`,
        loginURL: isCloud ? `${origin}/iap/doLogin` : undefined,
        chineseName: data.name,
        captchaAuthMode: edgeCase.getCaptchaPath.includes('slide') ? 1 : 0,
        authOrigin,
        isCloud,
        edgeCase,
      }
      log.success(
        `学校 ${data.name} 已完成设定，接入方式为 ${isCloud ? 'CLOUD' : 'NOTCLOUD'}`,
      )
    } else {
      throw new Error('Failed to get school edge case!')
    }
  }
  return schoolInfos
}
