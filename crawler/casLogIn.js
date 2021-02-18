const cheerio = require('cheerio')
const fetch = require('node-fetch')

const crypto = require('crypto')
const log = require('../interface/colorLog')
const ocr = require('./captcha')

const headers = {
  'Cache-control': 'max-age=0',
  'Accept-Encoding': 'gzip, deflate',
  Connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'User-agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
}

/**
 * login to SWMS(stu work magagement system) process
 *
 * @param {Object} school api info
 * @param {Object} user user info for login
 * @return {Object} cookie for cas and campusphere
 */
module.exports = async (school, user) => {
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
  res = await fetch(school.login, { headers })
  reCook(res, 1, cookie)

  // create document for crawling
  const body = await res.text()
  const $ = cheerio.load(body)
  const form = $('#pwdLoginDiv')

  // construct login form
  const auth = new URLSearchParams({
    username: user.username,
    password: new AES(
      user.password,
      $('#pwdEncryptSalt', form).attr('value')
    ).encrypt(),
    _eventId: $('#_eventId', form).attr('value'),
    captcha: '',
    rememberMe: true,
    cllt: $('#cllt', form).attr('value'),
    lt: '',
    execution: $('#execution', form).attr('value'),
  })

  // check captcha is needed
  res = await fetch(`${school.checkCaptcha}?username=${user.username}`, {
    headers,
  })
  if (Boolean((await res.json()).isNeed)) {
    log.warning(`用户${name}: 登录需要验证码，正在用 OCR 识别`)
    const captcha = (await ocr(school.getCaptcha)).replace(/\s/g, '')

    if (captcha.length === 4) {
      log.warning(`用户${name}: 使用验证码 ${captcha} 登录`)
    } else {
      log.warning(`用户${name}: 验证码识别失败，长度${captcha.length}错误`)
      return
    }
  }

  // login with form
  headers['Content-Type'] = 'application/x-www-form-urlencoded'
  try {
    // 401, 400, 500 Res should be manually caught
    res = await fetch(school.login, {
      headers,
      body: auth.toString(),
      redirect: 'manual',
      method: 'POST',
    })
  } catch (e) {
    console.log(e)
    return
  }

  reCook(res, 1, cookie)

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
    reCook(null, 0, cookie)
    res = await fetch(redirect, {
      headers,
      redirect: 'manual',
    })
  } catch (e) {
    console.error(e)
    return
  }
  if (res.status === 302 && reCook(res, 0, cookie)) {
    log.success(`用户${name}: 登录成功`)
  } else {
    return
  }

  return cookie
}

/**
 * refresh cookie in headers (for next request)
 *
 * @param {Object} headers refresh target
 * @param {Object} res response object
 * @param {Object} cookie
 */
function reCook(res, isCas, cookie) {
  let cook
  try {
    cook = res.headers.raw()['set-cookie']
    cook.forEach(e => {
      if (e.includes('authserver')) {
        cookie.swms += e.match(/^(\w|\d|\s)+\=(\w|\d|\s|\-)+;/)[0]
      } else {
        cookie.campusphere += e.match(/^(\w|\d|\s)+\=(\w|\d|\s|\-)+;/)[0]
      }
    })
  } catch (e) {
    return false
  }
  headers.cookie = isCas ? cookie.swms : cookie.campusphere
  return true
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
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz1234567890'
    return Array(len)
      .fill(null)
      .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
  }
}
