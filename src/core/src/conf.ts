import fs from 'node:fs'
import path from 'node:path'

import * as toml from '@iarna/toml'
import fetch from 'node-fetch'
import log from './utils/logger.js'
const { parse } = toml

import type { Response } from 'node-fetch'
import type { SchoolConf, UsersConf } from './types/conf'
import type { SchoolEdgeCase } from './types/edge-case'
import type { StringKV } from './types/helper'
import { sstore } from './index.js'

const cwd = process.cwd()

export function loadConfFromToml(customPath?: string): UsersConf | null {
  sstore.clear()
  const resolvedPath = path.join(cwd, customPath ?? './conf.toml')
  if (fs.existsSync(resolvedPath)) {
    const usersConf = parse(fs.readFileSync(resolvedPath, 'utf8')) as UsersConf
    log.success({
      message: '成功加载用户',
      suffix: `${usersConf.users.map((u) => `@${u.alias}`).join(' ')}`,
    })
    return usersConf
  } else {
    log.error('配置文件不存在')
  }
  return null
}

export async function getSchoolInfos({
  users,
  localEdgeCasesFile,
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
    let edgeCase: any

    if (localEdgeCasesFile) {
      localEdgeCasesFile = path.join(cwd, localEdgeCasesFile)
      if (fs.existsSync(localEdgeCasesFile)) {
        edgeCase = JSON.parse(fs.readFileSync(localEdgeCasesFile, 'utf8'))
      } else {
        log.error('Edge-Cases 文件不存在')
        return null
      }
    } else {
      const edgeCaseRes = await fetch(
        `https://cea.beetcb.com/api/edge-case?name=${
          encodeURIComponent(
            data.name,
          )
        }&c=${isCloud ? 'true' : ''}`,
      ).catch(log.error)

      if (edgeCaseRes?.ok) {
        edgeCase = (await edgeCaseRes.json()) as SchoolEdgeCase
      } else {
        log.error('API 获取 Edge-Cases 失败')
        return null
      }
    }

    edgeCase = { ...edgeCase, ...edgeCase[isCloud ? 'CLOUD' : 'NOTCLOUD'] }

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
  }

  return schoolInfos
}
