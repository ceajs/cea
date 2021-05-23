// import {
//   CampusphereEndpoint,
//   sstore,
//   handleCookie,
//   log,
//   StringKV,
// } from '../../../src/'

import fetch from 'node-fetch'
import crypto from 'crypto'
import { v1 } from 'uuid'
/*
exports.signApp = class Checkin {
  private headers: StringKV
  constructor(school, user) {
    this.headers = {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
      'content-type': 'application/json',
    }
    this.addr = school.addr
    this.id = user.username
    // temporary store user info to reuse it, fix circular ref
    process.env[user.username] = user
  }
  async signInfo(cookie) {
    const user = process.env[this.id]
    if (!cookie) {
      return true
    }
    this.headers.cookie = cookie['campusphere::/']
    const { signApi, headers } = this

    const res = await fetch(signApi.list, {
      method: 'POST',
      headers,
      body: JSON.stringify({}),
    })
    // TODO: handle the responsed updated cookie
    if (!res.headers.get('content-type').includes('application/json')) {
      return true
    }
    const signQ = await res.json()
    const isValidCookie = signQ.message === 'SUCCESS'
    if (isValidCookie) {
      const data = signQ.datas
      this.curTask = data.unSignedTasks[0] || data.leaveTasks[0]
      return false
    }
    return true
  }

  async signWithForm() {
    if (!this.curTask) {
      this.result = { 签到结果: '今日签到任务已完成或COOKIE无效，取消签到' }
      return
    }
    const { signApi, headers } = this
    const {
      curTask: { signInstanceWid, signWid },
    } = this

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
      signPlaceSelected,
      isNeedExtra,
      signedStuInfo,
    } = signDetails.datas

    const placeList = signPlaceSelected
    const isSignAtHome = process.env[this.id].addr
    ;[longitude, latitude] = isSignAtHome
      ? this.signAtHomePos()
      : this.locale(placeList[0])

    const extraFieldItems = this.fillExtra(extraField)

    const form = {
      signInstanceWid,
      longitude,
      latitude,
      isNeedExtra,
      extraFieldItems,
      isMalposition: isSignAtHome ? 1 : 0,
      abnormalReason: '',
      signPhotoUrl: '',
      position: this.addr,
      uaIsCpadaily: true,
      signVersion: '1.0.0',
    }

    headers['Cpdaily-Extension'] = this.extention(form)
    res = await fetch(signApi.sign, {
      headers,
      method: 'POST',
      body: JSON.stringify(form),
    })
    res = await res.json()

    const logInfo = {
      签到结果: res.message,
      签到地址: form.position,
      真实信息: signedStuInfo.userName,
    }

    // Hide sensitive info on github actions, cause it's public by default
    if (process.env.GITHUB_ACTION) {
      delete logInfo['签到地址']
      delete logInfo['真实信息']
    }

    // store result
    this.result = logInfo
  }

  // TODO: decouple this.addr form signAtHomePos
  signAtHomePos() {
    const user = process.env[this.id]

    // Hard coded position info
    // Randomly generated from http://api.map.baidu.com/lbsapi
    const userAddr = user.addr
    const noRandom = userAddr instanceof Array
    const posGenFromCitys = noRandom
      ? [userAddr]
      : [
          ['116.622631', '40.204822', '北京市顺义区X012'],
          ['115.825701', '32.914915', '安徽省阜阳市颍泉区胜利北路79'],
          ['119.292590', '26.164789', '福建省福州市晋安区'],
          ['103.836093', '36.068012', '甘肃省兰州市城关区南滨河东路709'],
          ['108.360128', '22.883516', '广西壮族自治区南宁市兴宁区'],
          ['113.391549', '22.590350', '广东省中山市兴港中路172号'],
          ['111.292396', '30.718343', '湖北省宜昌市西陵区珍珠路32号'],
          ['118.793117', '32.074771', '江苏省南京市玄武区昆仑路8号'],
        ]
    const genNum = Math.floor(Math.random() * posGenFromCitys.length)
    this.addr = posGenFromCitys[genNum][2]
    return this.locale({
      longitude: posGenFromCitys[genNum][0] + '',
      latitude: posGenFromCitys[genNum][1] + '',
    })
  }

  // construct coordinates & format coordinates length
  locale({ longitude, latitude }) {
    return [longitude.slice(0, 10), latitude.slice(0, 9)].map((e) => {
      if (e[e.length - 1] === '0') {
        e = e.replace(/\d{1}$/, '1')
      }
      return Number(e)
    })
  }

  // select right item with content&wid
  fillExtra(extraField) {
    return extraField.map((e) => {
      let chosenWid
      const normal = e.extraFieldItems.filter((i) => {
        if (i.isAbnormal === false) chosenWid = i.wid
        return !i.isAbnormal
      })[0]
      return {
        extraFieldItemWid: chosenWid,
        extraFieldItemValue: normal.content,
      }
    })
  }

  // construct and encrypte Cpdaily_Extension for header
  extention(form) {
    const Cpdaily_Extension = {
      lon: form.longitude.toString(),
      model: 'Cock',
      appVersion: '8.2.14',
      systemVersion: '4.4.4',
      userId: process.env[this.id].username,
      systemName: 'android',
      lat: form.latitude.toString(),
      deviceId: v1(),
    }
    return this.encrypt(Cpdaily_Extension)
  }

  encrypt(ce) {
    const algorithm = 'des-cbc'
    const key = 'b3L26XNL'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(JSON.stringify(ce), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  decrypt() {
    const algorithm = 'des-cbc'
    const key = 'b3L26XNL'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const encrypted = 'long base 64'

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
  }
}

*/
