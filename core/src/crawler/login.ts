import cheerio from 'cheerio'
import crypto from 'crypto'
import getEdgeCases from '../compatibility/edge-case'
import log from '../utils/logger'
import ocr from './capcha'

import type { Response } from 'node-fetch'
import type {
  DefaultProps,
  EdgeCasesSchools,
  SchoolConfOpts,
  UserConfOpts,
} from '../types/conf'
import type { HandleCookieOptions } from '../types/cookie'
import type { StringKV } from '../types/helper'

import UserAgent from 'user-agents'
import FetchWithCookie from '../utils/fetch-helper'

/**
 * Process to login to the unified auth
 */
export default async function login(
  school: SchoolConfOpts,
  user: UserConfOpts,
  { preAuthURL, preCookieURLArray, authURL }: HandleCookieOptions,
) {
  // improve school campatibility with defaults and edge-cases
  const schoolEdgeCases: DefaultProps = getEdgeCases(
    school.chineseName as EdgeCasesSchools,
    school.isIap,
  )

  const headers: StringKV = {
    'User-agent': new UserAgent().toString(),
    'Upgrade-Insecure-Requests': '1',
  }

  const fetch = new FetchWithCookie(headers)
  const name = user.alias

  let res: Response

  if (preCookieURLArray?.length) {
    for (const preCookieURL of preCookieURLArray) {
      await fetch.get(preCookieURL)
    }
  }

  // ensure redirecting to the right auth service, fallback to campuseAuthStartEndpoint
  res = await fetch.get(authURL || preAuthURL || school.preAuthURL)

  if (!authURL) {
    res = await fetch.follow()
    authURL = fetch.lastRedirectUrl!
  }

  // grab hidden input name-val ue, this maybe error-prone, but compatible
  const hiddenInputNameValueMap: StringKV = {}
  let pwdSalt
  if (schoolEdgeCases.formIdx !== undefined) {
    // create document for crawling
    const body = await res.text()
    const $ = cheerio.load(body)
    const form = $('form[method=post]').get(schoolEdgeCases.formIdx)
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
  } else {
    // if we got here, this site definitely uses AJAX to get those props (`iap`)
    // we need to request those properties manually
    headers.Referer = res.headers.get('location')!
    const ltWrapper = new URL(headers.Referer).search
    if (Object.keys(hiddenInputNameValueMap).length === 0) {
      res = await fetch.get(`${school.auth}${schoolEdgeCases.lt}${ltWrapper}`)
      const { result } = await res.json()
      Object.defineProperties(hiddenInputNameValueMap, {
        lt: { value: result._lt, enumerable: true },
        needCaptcha: { value: result.needCapt, enumerable: true },
        dllt: { value: '', enumerable: true },
        iap: { value: true, enumerable: true },
      })
      // seems dcampus forgot to impl _encryptSalt, comment it out temporarily
      // pwdSalt = result._encryptSalt
    }
  }

  // construct login form
  const auth = new URLSearchParams({
    username: user.username,
    password: pwdSalt
      ? new AES(user.password, pwdSalt).encrypt()
      : user.password,
    ...hiddenInputNameValueMap,
    rememberMe: String(schoolEdgeCases.rememberMe),
  })

  // check captcha is needed
  const addtionalParams =
    `?username=${user.username}&ltId=${hiddenInputNameValueMap.lt || ''}`
  const needCaptcha = hiddenInputNameValueMap.needCaptcha === undefined
    ? (
      await (
        await fetch.get(
          `${school.auth}${schoolEdgeCases.checkCaptchaPath}${addtionalParams}`,
        )
      ).text()
    ).includes('true')
    : hiddenInputNameValueMap.needCaptcha

  if (needCaptcha) {
    log.warn({
      message: '登录需要验证码，正在用 OCR 识别',
      suffix: `@${name}`,
    })
    const captcha = (
      await ocr(
        `${school.auth}${schoolEdgeCases.getCaptchaPath}${addtionalParams}`,
      )
    ).replace(/\s/g, '')

    if (captcha.length >= 4) {
      log.success({
        message: `使用验证码 ${captcha} 登录`,
        suffix: `@${name}`,
      })
      auth.append('captcha', captcha)
    } else {
      log.error({
        message: `验证码识别失败，长度${captcha.length}错误`,
        suffix: `@${name}`,
      })
      return
    }
  }

  res = await fetch.post(authURL, {
    type: 'form',
    body: auth.toString(),
  })

  const isRedirect = res.headers.get('location')
  if (!isRedirect) {
    log.error({ message: `登录失败，${res.statusText}`, suffix: `@${name}` })
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

  // redirect to campus, get MOD_AUTH_CAS
  await fetch.follow()
  return fetch.getCookieObj()
}

class AES {
  private pwd: string
  private key: string
  constructor(pwd: string, key: string) {
    this.pwd = pwd
    this.key = key
  }

  encrypt() {
    const { key, pwd } = this

    const rs = this.randomString
    const data = rs(64) + pwd

    const algorithm = 'aes-128-cbc'
    const iv = Buffer.alloc(16, 0)

    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let en = cipher.update(data, 'utf8', 'base64')
    en += cipher.final('base64')
    return en
  }

  randomString(len: number) {
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    return Array(len)
      .fill(null)
      .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
  }
}
