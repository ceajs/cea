const fetch = require('node-fetch')
const log = require('../interface/colorLog')

class campusphereApp {
  constructor(school) {
    this.signApi = {
      list: `${school.origin}/wec-counselor-sign-apps/stu/sign/queryDailySginTasks`,
      detail: `${school.origin}/wec-counselor-sign-apps/stu/sign/detailSignTaskInst`,
    }
  }
}

class signApp extends campusphereApp {
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

    const signQ = await res.json()
    this.curTask = signQ.datas.unSignedTasks[0]
    return this
  }
  async signWithForm() {
    const { signApi, headers } = this
    const { signInstanceWid, signWid } = this.curTask

    const res = await fetch(signApi.detail, {
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
      position,
      signPlaceSelected,
    } = signDetails.datas

    ;[longitude, latitude] = this.randomLocale(signPlaceSelected[0])
    const extraFieldItems = this.fillExtra(extraField)
    log.object(extraFieldItems)

    /**
     * {'extraFieldItems':
     *  [{'extraFieldItemValue': '正常', 'extraFieldItemWid': 603014},
     *  {'extraFieldItemValue': '正常', 'extraFieldItemWid': 603016}],
     * 'signInstanceWid': '16554',
     * 'longitude': 114.241294,
     * 'latitude': 30.643062,
     * 'isMalposition': 0,
     * 'position': '中国湖北省武汉市东西胡区公园南路'}
     */
  }

  randomLocale({ longitude, latitude, radius }) {
    const [perMeterLat, perMeterLon] = [
      360 / (Math.cos(latitude) * 40075016.68557849),
      0.000008983,
    ]

    longitude += radius * perMeterLon * Math.random()
    latitude += radius * perMeterLat * Math.random()
    return [longitude, latitude]
  }

  fillExtra(extraField) {
    return extraField.map(e => {
      const normal = e.extraFieldItems.filter(i => i.isAbnormal === false)[0]
      return { extraFieldItemValue: normal.content, extraFieldItemWid: e.wid }
    })
  }
}

module.exports = { signApp }
