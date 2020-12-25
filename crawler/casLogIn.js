const cheerio = require('cheerio')
const fetch = require('node-fetch')

const crypto = require('crypto')
const log = require('../interface/colorLog')
const ocr = require('./captcha')

const headers = {
  'cache-control': 'max-age=0',
  'Accept-Encoding': 'gzip, deflate',
  connection: 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
  'user-agent':
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

  const name = user.alias || user.username

  headers.referer = school.login

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
    rememberMe: 'true',
    cllt: $('#cllt', form).attr('value'),
    lt: '',
    execution: $('#execution', form).attr('value'),
  })

  // check captcha is needed
  res = await fetch(`${school.checkCaptcha}?username=${user.username}`, {
    headers,
  })
  if (Boolean((await res.json()).isNeed)) {
    auth.set('captcha', await ocr(school.getCaptcha))
    if (auth.get('captcha').length === 4) {
      log.warning(`${name}: Login with captcha: ${auth.get('captcha')}`)
    } else {
      log.warning(`${name}: OCR captcha failed!`)
      return null
    }
  }

  // login with form
  headers['content-type'] = 'application/x-www-form-urlencoded'
  try {
    res = await fetch(school.login, {
      headers,
      body: auth.toString(),
      redirect: 'manual',
      method: 'POST',
    })
  } catch (e) {
    log.error(e)
  }

  reCook(res, 1, cookie)
  delete headers['content-type']

  // get campus cookie
  try {
    reCook(null, 0, cookie)
    const redirect = res.headers.get('location')
    res = await fetch(redirect, {
      headers,
      redirect: 'manual',
    })
  } catch (e) {
    log.error(name)
    log.object(res)
    return null
  }

  if (res.status === 302 && reCook(res, 0, cookie)) {
    log.success(`用户${name}: Login Success`)
  } else {
    log.error(`${res.statusText}: ${name}`)
    return null
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
    const str = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    return Array(len)
      .fill(null)
      .reduce((s = '') => (s += str.charAt(Math.floor(Math.random() * 48))), '')
  }
}
