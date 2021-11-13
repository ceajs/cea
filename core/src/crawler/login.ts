import cheerio from 'cheerio'
import UserAgent from 'user-agents'
import FetchWithCookie from '../utils/fetch-helper.js'

import { UnifiedLoginResultCodeMsg } from '../types/login.js'
import AES from '../utils/encrypt.js'
import log from '../utils/logger.js'
import { captchaHandler } from './captcha.js'

import type { SchoolConfOpts, UserConfOpts } from '../types/conf'
import type { SchoolEdgeCase } from '../types/edge-case'
import type { StringKV } from '../types/helper'
import type { UnifiedLoginResult } from '../types/login'

/**
 * Process to login to the unified auth
 */
export default async function login(
  school: SchoolConfOpts,
  user: UserConfOpts,
) {
  // improve school campatibility with defaults and edge-cases
  const schoolEdgeCase: SchoolEdgeCase = school.edgeCase

  const headers: StringKV = {
    'User-agent': new UserAgent().toString(),
    'Upgrade-Insecure-Requests': '1',
  }

  const fetch = new FetchWithCookie(headers)
  const name = user.alias

  let res = await fetch.get(school.preAuthURL)
  let loginURL = school.loginURL

  if (!loginURL) {
    res = await fetch.follow()
    loginURL = fetch.lastRedirectUrl!
  }

  const hiddenInputNameValueMap: StringKV = {}
  let pwdSalt, needCaptcha: boolean
  if (!school.isCloud) {
    // create document for crawling
    const body = await res.text()
    const $ = cheerio.load(body)
    const form = $('form[method=post]').get(schoolEdgeCase.formIdx)
    const hiddenInputList = $('input[type=hidden]', form!)

    hiddenInputList.each((e: number) => {
      const hiddenInputNode = hiddenInputList[e]
      const [name, value] = [
        hiddenInputNode.attribs.name,
        hiddenInputNode.attribs.value,
      ]
      if (name && value) {
        hiddenInputNameValueMap[name] = value
      } else if (value) {
        // password salt here
        pwdSalt = value
      }
    })

    // Check captcha
    const addtionalParams =
      `?username=${user.username}&ltId=${hiddenInputNameValueMap.lt || ''}`
    needCaptcha = (
      await (
        await fetch.get(
          `${school.authOrigin}${schoolEdgeCase.checkCaptchaPath}${addtionalParams}`,
        )
      ).text()
    ).includes('true')
  } else {
    // If we got here, this site definitely uses AJAX to get those props (`CLOUD`)
    // we need to request those properties manually
    res = await fetch.get(res.headers.get('location')!)
    const ltWrapper = res.headers.get('location')?.split('_2lBepC=')[1]
    res = await fetch.post(`${school.authOrigin}${schoolEdgeCase.getLtPath}`, {
      type: 'form',
      body: `lt=${ltWrapper}`,
    })
    const { result } = (await res.json()) as any
    // Based on cur logic, result.needCaptcha will never be true
    needCaptcha = false
    Object.defineProperties(hiddenInputNameValueMap, {
      lt: { value: result._lt, enumerable: true },
      dllt: { value: '', enumerable: true },
    })
    // Seems dcampus forgot to impl _encryptSalt, comment it out temporarily
    // pwdSalt = result._encryptSalt
  }

  // Construct login form
  const auth = new URLSearchParams({
    username: user.username,
    password: pwdSalt
      ? new AES(user.password, pwdSalt).encrypt()
      : user.password,
    ...hiddenInputNameValueMap,
  })

  // Handle captcha
  while (true) {
    if (needCaptcha) {
      const captchaUrl =
        `${school.authOrigin}${schoolEdgeCase.getCaptchaPath}?username=${user.username}&ltId=${hiddenInputNameValueMap
          .lt ?? ''}`
      log.warn({
        message: '登录需要验证码',
        suffix: `@${name}`,
      })
      let captchaCode = await captchaHandler(captchaUrl, fetch, user.captcha)
      if (captchaCode?.length >= 4) {
        log.warn({
          message: `使用验证码 ${captchaCode} 登录`,
          suffix: `@${name}`,
        })
        auth.append(schoolEdgeCase.submitCaptchakey, captchaCode)
      } else {
        log.error({
          message: `验证码格式错误，结果为${captchaCode}，长度错误`,
          suffix: `@${name}`,
        })
        return
      }
    }

    res = await fetch.post(loginURL, {
      type: 'form',
      body: auth.toString(),
    })

    const isRedirect = res.headers.get('location')
    if (!isRedirect) {
      if (school.isCloud) {
        const result = (await res.json()) as UnifiedLoginResult
        log.error({
          message: UnifiedLoginResultCodeMsg[result.resultCode],
          suffix: `@${name}`,
        })
        // Handle captcha(CLOUD)
        if (result.needCaptcha && !needCaptcha) {
          needCaptcha = true
          continue
        }
      } else {
        log.error({
          message: `登录失败，${res.statusText}`,
          suffix: `@${name}`,
        })
      }
      return
    } else if (isRedirect.includes('.do')) {
      log.error({
        message: `登录失败，密码安全等级低，需要修改`,
        suffix: `@${name}`,
      })
      return
    } else {
      log.success({
        message: `登录成功`,
        suffix: `@${name}`,
      })
    }

    // Redirect to campus, get MOD_AUTH_CAS
    await fetch.follow()
    return fetch.getCookieObj()
  }
}
