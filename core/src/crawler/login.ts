import sliderCaptchaRecognizer from '@ceajs/slider-captcha'
import cheerio from 'cheerio'
import UserAgent from 'user-agents'
import FetchWithCookie from '../utils/fetch-helper.js'

import { CaptchaAuthMode } from '../types/conf.js'
import {
  SliderCaptchaGetResult,
  SliderCaptchaVerifyResult,
  UnifiedLoginResultCodeMsg,
} from '../types/login.js'
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
  user: UserConfOpts
) {
  // improve school campatibility with defaults and edge-cases
  const schoolEdgeCase: SchoolEdgeCase = school.edgeCase

  const headers: StringKV = {
    'user-agent': new UserAgent({ deviceCategory: 'desktop' }).toString(),
    'upgrade-insecure-requests': '1',
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
    // Create document for crawling
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
    const addtionalParams = `?username=${user.username}&ltId=${
      hiddenInputNameValueMap.lt || ''
    }&_=${Date.now()}`
    needCaptcha = (
      await (
        await fetch.get(
          `${school.authOrigin}${schoolEdgeCase.checkCaptchaPath}${addtionalParams}`
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
      const captchaUrl = `${school.authOrigin}${
        schoolEdgeCase.getCaptchaPath
      }?username=${user.username}&ltId=${
        hiddenInputNameValueMap.lt ?? ''
      }&_=${Date.now()}`
      log.warn({
        message: '登录需要验证码',
        suffix: `@${name}`,
      })

      if (school.captchaAuthMode === CaptchaAuthMode.IMAGE) {
        // Handle image captcha using ocr
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
      } else if (school.captchaAuthMode === CaptchaAuthMode.SLIDER) {
        // Handle slider captcha using @ceajs/slider-captcha
        if (!schoolEdgeCase.verifySliderCaptchaPath?.length) {
          log.error({
            message: `学校边缘配置中未出现 verifySliderCaptchaPath 字段，放弃登录`,
            suffix: `@${name}`,
          })
          return
        }

        const response = await fetch.get(captchaUrl)
        const source: SliderCaptchaGetResult = await response.json()
        const percentage = await sliderCaptchaRecognizer(
          source.bigImage,
          source.smallImage
        )
        const sliderCanvasLength = schoolEdgeCase.sliderCanvasLength ?? 280
        if (percentage) {
          const moveLength = Math.floor(sliderCanvasLength * percentage)
          const verifySliderUrl = `${school.authOrigin}${schoolEdgeCase.verifySliderCaptchaPath}?canvasLength=${sliderCanvasLength}&moveLength=${moveLength}`
          log.warn({
            message: `开始滑块验证，移动比例：${moveLength} / ${sliderCanvasLength}`,
            suffix: `@${name}`,
          })
          const respose = await fetch.get(verifySliderUrl)
          const result: SliderCaptchaVerifyResult = await respose.json()
          if (result.sign) {
            auth.append('sign', result.sign)
            log.success({
              message: `成功通过滑块验证`,
              suffix: `@${name}`,
            })
          } else {
            log.error({
              message: `自动滑块验证失败`,
              suffix: `@${name}`,
            })
            return
          }
        }
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
          message: `登录失败，请尝试本地登录 ${school.preAuthURL} 以确保账号密码正确 @${name}`,
        })
      }
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
