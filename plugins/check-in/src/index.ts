import { CampusphereEndpoint } from 'cea-core'
import { LogInfoKeys } from './types.js'
import { Md5 } from 'ts-md5/dist/md5'
import { handleCookie, sstore } from 'cea-core'
import crypto from 'crypto'
import fetch from 'node-fetch'
import * as uuid from 'uuid'

import type {
  CookieRawObject,
  SchoolConfOpts,
  StringKV,
  UserConfOpts,
  UsersConf,
} from 'cea-core'
import type {
  AllSignTasks,
  CpdailyExtension,
  CpdailyExtensionEncrypted,
  bodyStringEncrypted,
  GlobalLogInfo,
  LogInfo,
  SignForm,
  SignTask,
  SignTaskDetail,
} from './types'
import { json } from 'stream/consumers'
import { version } from 'os'

export class CheckIn {
  private headers: StringKV
  private user: UserConfOpts
  private school: SchoolConfOpts
  constructor(user: UserConfOpts) {
    const school = sstore.get('schools')[user.school]
    this.school = school
    this.user = user
    this.headers = {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
      'content-type': 'application/json',
    }
  }

  async signInfo(): Promise<AllSignTasks | void> {
    const { user, school } = this
    const storeCookiePath = `cookie.${user.alias}`
    const cookie: CookieRawObject = sstore.get(storeCookiePath)
    const campusCookieIdx = new URL(school.campusphere).host
    if (!cookie) {
      return
    }
    this.headers.cookie = cookie[campusCookieIdx]
    const res = await fetch(
      `${school.campusphere}${CampusphereEndpoint.getStuSignInfosInOneDay}`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({}),
      },
    )

    if (res.headers.get('content-type')?.includes('json')) {
      const signQ = (await res.json()) as any
      const isValidCookie = signQ.message === 'SUCCESS'
      if (isValidCookie) {
        return signQ.datas
      }
    }
  }

  async signWithForm(curTask: SignTask): Promise<LogInfo> {
    const { school, headers, user } = this
    const { signInstanceWid, signWid } = curTask

    let res = await fetch(
      `${school.campusphere}${CampusphereEndpoint.detailSignInstance}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify({ signInstanceWid, signWid }),
      },
    )
    const signDetails: SignTaskDetail = ((await res.json()) as any).datas

    let {
      extraField,
      longitude,
      latitude,
      signPlaceSelected,
      isNeedExtra,
      signedStuInfo,
    } = signDetails

    let position: string

    const placeList = signPlaceSelected[0]
    const isSignAtHome = !Boolean(school.defaultAddr)
      ;[longitude, latitude, position] = isSignAtHome
        ? this.user.addr
        : [placeList.longitude, placeList.latitude, school.defaultAddr]

    const extraFieldItems = this.fillExtra(extraField)

    const form: SignForm = {
      longitude: this.fixedFloatRight(longitude),
      latitude: this.fixedFloatRight(latitude),
      isMalposition: isSignAtHome ? 1 : 0,
      abnormalReason: '',
      signPhotoUrl: '',
      isNeedExtra,
      position,
      uaIsCpadaily: true,
      signInstanceWid,
      extraFieldItems,
    }
    const bodyString = this.Aes_encrpt(JSON.stringify(form))
    const signbody = {
      appVersion: '9.0.12',
      bodyString: bodyString,
      deviceId: uuid.v1(),
      lat: form.latitude.toString(),
      lon: form.longitude.toString(),
      model: 'Cock',
      systemName: 'android',
      systemVersion: 'Cock',
      userId: this.user.username,
    }
    let body_to_string = ''
    for (const key in signbody) {
      body_to_string += '${key}=${signBody[key]}&'
    }
    body_to_string += "ytUQ7l2ZZu8mLvJZ"
    const sign = Md5.hashStr(body_to_string)
    /* 按照抓包顺序
    const final_form = {
      lon: signbody.lon,
      version: 'first_v2',
      calVersion: 'firstv',
      deviceId: signbody.deviceId,
      userId: signbody.userId,
      systemName: signbody.systemName,
      bodyString: bodyString,
      lat: signbody.lat,
      systemVersion: signbody.systemVersion,
      appVersion: signbody.appVersion,
      module:signbody.model,
      sign: sign,
    }
    */
    const final_form = {
      ...signbody,
      version: 'first_v2',
      calVersion: 'firstv',
      sign: sign,
    }
    headers['Cpdaily-Extension'] = this.extention(form)
    res = await fetch(
      `${school.campusphere}${CampusphereEndpoint.submitSign}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify(final_form),
      },
    )
    const result = (await res.json()) as any

    const logInfo: LogInfo = {
      [LogInfoKeys.result]: result.message,
      [LogInfoKeys.addr]: form.position,
    }

    // Hide sensitive info on github actions, cause it's public by default
    if (process.env.GITHUB_ACTION) {
      delete logInfo[LogInfoKeys.addr]
    }

    // store result
    return logInfo
  }

  private fixedFloatRight(floatStr: string): number {
    return parseFloat(
      floatStr.replace(
        /(\d+\.\d{5})(\d{1})(.*)/,
        (s, p, p2) => `${p}${p2 == 0 ? 1 : p2}`,
      ),
    )
  }

  // select right item with content&wid
  private fillExtra(
    extraField: SignTaskDetail['extraField'],
  ): SignForm['extraFieldItems'] {
    return extraField.map((e) => {
      let chosenWid: string
      const normal = e.extraFieldItems.filter((i) => {
        if (i.isAbnormal === false) chosenWid = i.wid
        return !i.isAbnormal
      })[0]
      return {
        extraFieldItemWid: chosenWid!,
        extraFieldItemValue: normal.content,
      }
    })
  }

  // construct and encrypte Cpdaily_Extension for header
  private extention(form: SignForm) {
    const Cpdaily_Extension: CpdailyExtension = {
      lon: form.longitude.toString(),
      model: 'Cock',
      appVersion: '9.0.12',
      systemVersion: '11',
      userId: this.user.username,
      systemName: 'android',
      lat: form.latitude.toString(),
      deviceId: uuid.v1(),
    }
    return this.encrypt(Cpdaily_Extension)
  }

  private encrypt(ce: CpdailyExtension): CpdailyExtensionEncrypted {
    const algorithm = 'des-cbc'
    const key = 'b3L26XNL'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.

    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(JSON.stringify(ce), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }
  private Aes_encrpt(ce: string): bodyStringEncrypted {
    const algorithm = 'aes-cbc'
    const key = 'ytUQ7l2ZZu8mLvJZ'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7])
    const cipher = crypto.createCipheriv(algorithm, key, iv)
    let encrypted = cipher.update(JSON.stringify(ce), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  private decrypt() {
    const algorithm = 'des-cbc'
    const key = 'b3L26XNL'
    const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]) // Initialization vector.
    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const encrypted = 'long base 64'

    let decrypted = decipher.update(encrypted, 'base64', 'utf8')
    decrypted += decipher.final('utf8')
  }
}

export async function checkIn() {
  // Get cookie
  await handleCookie()
  // Log in and save cookie to cea
  const users = sstore.get('users')
  // Sign in
  let logs = await signIn(users)
  // Log out sign in result
  console.table(logs)
}

async function signIn(users: UsersConf): Promise<GlobalLogInfo> {
  const logs: GlobalLogInfo = {}
  // sign in asynchronizedly with promise all and diff instance of signApp class
  await Promise.all(
    users.map(async (i) => {
      const instance: CheckIn = new CheckIn(i)
      const curTask = await instance.signInfo()
      if (curTask) {
        const needCheckInTasks = curTask.unSignedTasks.concat(
          curTask.leaveTasks,
        )
        if (needCheckInTasks.length) {
          const result = await instance.signWithForm(needCheckInTasks[0])
          logs[i.alias] = result
        } else {
          logs[i.alias] = {
            [LogInfoKeys.result as string]: `已完成：${curTask.signedTasks[0].taskName
              }`,
          }
        }
      }
    }),
  )
  return logs
}
