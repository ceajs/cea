const fetch = require('node-fetch')
const crypto = require('crypto')
const { v1 } = require('uuid')

const log = require('../interface/colorLog')

class campusphereApp {
  constructor(school) {
    this.signApi = {
      list: `${school.origin}/wec-counselor-sign-apps/stu/sign/queryDailySginTasks`,
      detail: `${school.origin}/wec-counselor-sign-apps/stu/sign/detailSignTaskInst`,
      sign: `${school.origin}/wec-counselor-sign-apps/stu/sign/completeSignIn`,
      home: `${school.origin}/wec-counselor-sign-apps/stu/mobile`,
    }
  }
}

exports.signApp = class signApp extends (
  campusphereApp
) {
  constructor(school, user) {
    super(school)
    this.headers = {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
      'content-type': 'application/json',
      connection: 'keep-alive',
    }
    this.user = user
  }

  async getCookie(cookie) {
    if (!cookie.campusphere.includes('acw_tc')) {
      const res = await fetch(this.signApi.home, {
        headers: this.headers,
      })
      res.headers.raw()['set-cookie'].forEach(e => {
        cookie.campusphere += ';' + e.match(/^(\w|\d|\s)+\=(\w|\d|\s|\-)+;/)[0]
      }, '')
    }
    return cookie.campusphere
  }

  async signInfo(cookie) {
    // set acw_tc for user provided cookie
    this.headers.cookie = await this.getCookie(cookie)

    const { signApi, headers } = this
    try {
      const res = await fetch(signApi.list, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      })
      if (res.headers.hasOwnProperty('set-cookie')) return true
      const signQ = await res.json()
      this.curTask = signQ.datas.unSignedTasks[0]
      return false
    } catch (e) {
      return true
    }
  }

  async signWithForm() {
    const { signApi, headers } = this
    const { signInstanceWid, signWid } = this.curTask

    let res = await fetch(signApi.detail, {
      headers,
      method: 'POST',
      body: JSON.stringify({ signInstanceWid, signWid }),
    })

    const signDetails = await res.json()
    let {
      extraField,
      longitude,
      latitude,
      isMalposition,
      signPlaceSelected,
      isNeedExtra,
      signedStuInfo,
    } = signDetails.datas

    // format coordinates length
    ;[longitude, latitude] = this.randomLocale(signPlaceSelected[0]).map(e =>
      Number(e.toFixed(6))
    )

    const extraFieldItems = this.fillExtra(extraField)
    const { address } = signPlaceSelected[0]

    const form = {
      signInstanceWid,
      longitude,
      latitude,
      isMalposition,
      abnormalReason: '',
      signPhotoUrl: '',
      position: address,
      isNeedExtra,
      extraFieldItems,
    }
    log.object(form)
    // headers['Cpdaily-Extension'] = this.extention(form)

    // res = await fetch(signApi.sign, {
    //   headers,
    //   method: 'POST',
    //   body: JSON.stringify(form),
    // })
    // res = await res.json()
    // log.warning(
    //   `${this.user.alias || this.user.username} 的签到结果: ${res.message}`
    // )
  }

  // construct random coordinates
  randomLocale({ longitude, latitude, radius }) {
    const [perMeterLat, perMeterLon] = [
      360 / (Math.cos(latitude) * 40076000),
      0.000008983,
    ]
    const { PI, cos, sin } = Math
    const [randomLon, randomLat] = [
      cos(Math.random() * PI),
      sin(Math.random() * PI),
    ]
    longitude -= radius * perMeterLon * randomLon
    latitude -= radius * perMeterLat * randomLat
    return [longitude, latitude]
  }

  // select right item with content&wid
  fillExtra(extraField) {
    return extraField.map(e => {
      let chosenWid
      const normal = e.extraFieldItems.filter(i => {
        if (i.isAbnormal === false) chosenWid = i.wid
        return !i.isAbnormal
      })[0]
      return {
        extraFieldItemValue: normal.content,
        extraFieldItemWid: chosenWid,
      }
    })
  }

  // construct and encrypte Cpdaily_Extension for header
  extention(form) {
    const Cpdaily_Extension = {
      lon: form.longitude,
      model: 'One Plus 7 Pro',
      appVersion: '8.0.8',
      systemVersion: '4.4.4',
      userId: this.user.username,
      systemName: 'android',
      lat: form.latitude,
      deviceId: v1(),
    }
    return this.encrypt(Cpdaily_Extension)
  }

  /**
   * Device info: using AES encryption
   *
   * @param {Object} ce device info
   * @param {String} encrypted
   */
  encrypt(ce) {
    const algorithm = 'des-cbc'
    const key = 'ST83=@XV'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(JSON.stringify(ce), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  // useful when key updates
  decrypt() {
    const algorithm = 'des-cbc'
    const key = 'ST83=@XV'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const encrypted = 'long base 64'

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
  }
}
