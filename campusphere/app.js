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
    }
  }
}

exports.signApp = class signApp extends (
  campusphereApp
) {
  constructor(school, cookie) {
    super(school)
    this.headers = {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
      cookie: cookie.campusphere,
      'content-type': 'application/json',
      connection: 'keep-alive',
    }
  }

  async signInfo() {
    const { signApi, headers } = this
    const res = await fetch(signApi.list, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })

    if (res.headers.hasOwnProperty('set-cookie')) return true
    const signQ = await res.json()
    this.curTask = signQ.datas.unSignedTasks[0]
    return false
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
    ;[longitude, latitude] = this.randomLocale(signPlaceSelected[2]).map(
      e => e.toString().slice(0, 9) - 0
    )

    const extraFieldItems = this.fillExtra(extraField)
    const { address } = signPlaceSelected[2]
    const form = {
      signInstanceWid,
      longitude,
      latitude,
      isMalposition,
      position: address,
      isNeedExtra,
      extraFieldItems,
    }

    headers['Cpdaily-Extension'] = this.extention()

    res = await fetch(signApi.sign, {
      headers,
      method: 'POST',
      body: JSON.stringify(form),
    })
    res = await res.json()
    log.warning(`${signedStuInfo.userName}的签到结果: ${res.message}`)

    res.code === '0' ? process.exit(0) : process.exit(1)
  }

  // construct random coordinates
  randomLocale({ longitude, latitude, radius }) {
    const [perMeterLat, perMeterLon] = [
      360 / (Math.cos(latitude) * 40075016.68557849),
      0.000008983,
    ]
    const [randomLon, randomLat] = [Math.random(), Math.random()]
    longitude -= radius * perMeterLon * (randomLon - 0.5) * -1 * randomLon
    latitude -= radius * perMeterLat * (randomLat - 0.5) * -1 * randomLat
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
  extention() {
    const Cpdaily_Extension = {
      lon: 0,
      model: 'PCRT00',
      appVersion: '8.0.8',
      systemVersion: '4.4.4',
      userId: '',
      systemName: 'android',
      lat: 0,
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
