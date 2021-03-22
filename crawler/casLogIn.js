const cheerio = require('cheerio')
const crypto = require('crypto')
const fetch = require('node-fetch')
const log = require('../interface/colorLog')
const ocr = require('./captcha')

/**
 * login to SWMS(stu work magagement system) process
 * @param {object} school api info
 * @param {object} user user info for login
 * @return {object} cookie for cas and campusphere
 */
module.exports = async (school, user) => {
  // improve school campatibility with defaults and edge-cases
  const schoolEdgeCases = require('./school-edge-cases')(school.name, school.casOrigin.includes('iap'))

  const headers = {
    'Cache-Control': 'max-age=0',
    'Accept-Encoding': 'gzip, deflate',
    'Upgrade-Insecure-Requests': '1',
    'User-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  }

  const cookie = {
    swms: '',
    campusphere: '',
  }

  const name = user.alias

  // deal with anti crawlers
  headers.Referer = school.login
  headers.Host = new URL(school.casOrigin).host
  headers.Origin = `https://${headers.Host}`

  // get base session -> cookie
  res = await fetch(school.login, { headers, redirect: 'manual' })
  reCook(res, 1)

  // grab hidden input name-value, this maybe error-prone, but compatible
  const hiddenInputNameValueMap = {}
  let pwdSalt = null
  if (schoolEdgeCases.formIdx) {
    // create document for crawling
    const body = await res.text()
    const $ = cheerio.load(body)
    const form = $('form[method=post]').get(schoolEdgeCases.formIdx)
    const hiddenInputList = $('input[type=hidden]', form)

    hiddenInputList.each((e) => {
      const hiddenInputNode = hiddenInputList[e]
      const [name, value] = [hiddenInputNode.attribs.name, hiddenInputNode.attribs.value]
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
    headers.Referer = res.headers.get('location')
    const ltWrapper = new URL(headers.Referer).search
    if (Object.keys(hiddenInputNameValueMap).length === 0) {
      res = await fetch(`${school.casOrigin}${schoolEdgeCases.lt}${ltWrapper}`, {
        headers,
        method: 'POST',
      })
      const { result } = await res.json()
      Object.defineProperties(hiddenInputNameValueMap, {
        lt: { value: result._lt, enumerable: true },
        needCaptcha: { value: result.needCapt, enumerable: true },
        dllt: { value: '', enumerable: true },
        iap: { value: true, enumerable: true },
      })
      // seems dcampus forgot to impl _encryptSalt, comment it out temporarily
      // pwdSalt = result._encryptSalt
      reCook(res, 1)
    }
  }

  // construct login form
  const auth = new URLSearchParams({
    username: user.username,
    password: pwdSalt ? new AES(user.password, pwdSalt).encrypt() : user.password,
    ...hiddenInputNameValueMap,
    rememberMe: schoolEdgeCases.rememberMe,
  })

  // check captcha is needed
  const addtionalParams = `?username=${user.username}&ltId=${hiddenInputNameValueMap.lt}`
  const needCaptcha =
    hiddenInputNameValueMap.needCaptcha === undefined
      ? (
          await (
            await fetch(`${school.casOrigin}${schoolEdgeCases.checkCaptchaPath}${addtionalParams}`, {
              headers,
            })
          ).text()
        ).includes('true')
      : hiddenInputNameValueMap.needCaptcha

  if (needCaptcha) {
    log.warning(`用户${name}: 登录需要验证码，正在用 OCR 识别`)
    const captcha = (await ocr(`${school.casOrigin}${schoolEdgeCases.getCaptchaPath}${addtionalParams}`)).replace(
      /\s/g,
      ''
    )

    if (captcha.length >= 4) {
      log.warning(`用户${name}: 使用验证码 ${captcha} 登录`)
      auth.append('captcha', captcha)
    } else {
      log.warning(`用户${name}: 验证码识别失败，长度${captcha.length}错误`)
      return
    }
  }

  // login with form
  headers['Content-Type'] = 'application/x-www-form-urlencoded'
  try {
    res = await fetch(hiddenInputNameValueMap.iap ? `${school.casOrigin}/doLogin` : school.login, {
      headers,
      body: auth.toString(),
      redirect: 'manual',
      method: 'POST',
    })
  } catch (e) {
    console.log(e)
    return
  }

  reCook(res, 0)

  // set redirect headers
  delete headers['Content-Type']
  delete headers.Host
  headers.Referer = headers.Origin

  const redirect = res.headers.get('location')
  if (!redirect) {
    log.error(`用户${name}：登录失败，${res.statusText}`)
    return
  }

  // get campus cookie
  try {
    res = await fetch(redirect, {
      headers,
      redirect: 'manual',
    })
  } catch (e) {
    console.error(e)
    return
  }
  if (/30(1|2)/.test(res.status + '') && reCook(res, 0)) {
    log.success(`用户${name}: 登录成功`)
  } else {
    log.error(`用户${name}：登录失败，${res.statusText}`)
    return
  }

  /**
   * refresh cookie in headers (for next request)
   * @param {object} res response object
   * @param {boolean | number} isCas is swms(only) cookie
   * @return {boolean} true if set-cookie exists
   */
  function reCook(res, isCas) {
    try {
      const setCookieList = res.headers.raw()['set-cookie']
      setCookieList.forEach((e) => {
        const content = e.split(';').shift()
        if (isCas) {
          cookie.swms += `${content}; `
        } else {
          cookie.campusphere += `${content}; `
        }
      })
    } catch (e) {
      return false
    }
    headers.cookie = isCas ? cookie.swms : cookie.campusphere
    return true
  }

  return cookie
}

class AES {
  constructor(pwd, key) {
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

  randomString(len) {
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    return Array(len)
      .fill(null)
      .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
  }
}
