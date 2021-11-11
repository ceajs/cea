import crypto from 'crypto'

import { CampusphereEndpoint } from 'cea-core'
import { handleCookie, log, sstore } from 'cea-core'
import fetch from 'node-fetch'
import * as uuid from 'uuid'
import { LogInfoKeys, PostFormBody } from './types.js'

import type {
  CookieRawObject,
  SchoolConfOpts,
  StringKV,
  UserConfOpts,
  UsersConf,
} from 'cea-core'
import type {
  AllSignTasks,
  GlobalLogInfo,
  LogInfo,
  SignExtensionBody,
  SignFormBody,
  SignHashBody,
  SignTask,
  SignTaskDetail,
} from './types'

import type * as CheckInTypes from './types'
export type { CheckInTypes }

export class CheckIn {
  static readonly VERSION = {
    app: '9.0.12',
    version: 'first_v2',
    calVersion: 'firstv',
  }
  static readonly EXTENSION_ENCRYPT = {
    key: 'b3L26XNL',
    iv: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]),
    algo: 'des-cbc',
  }
  static readonly FORMBODY_ENCRYPT = {
    key: 'ytUQ7l2ZZu8mLvJZ',
    iv: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7]),
    algo: 'aes-128-cbc',
  }

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

    const extraFieldItems = CheckIn.fillExtra(extraField)

    const formBody: SignFormBody = {
      longitude: CheckIn.fixedFloatRight(longitude),
      latitude: CheckIn.fixedFloatRight(latitude),
      isMalposition: isSignAtHome ? 1 : 0,
      abnormalReason: '',
      signPhotoUrl: '',
      isNeedExtra,
      position,
      uaIsCpadaily: true,
      signInstanceWid,
      extraFieldItems,
    }
    const bodyString = CheckIn.formBodyEncrypt(formBody)

    const signHashBody: SignHashBody = {
      appVersion: CheckIn.VERSION.app,
      bodyString,
      deviceId: uuid.v1(),
      lat: formBody.latitude,
      lon: formBody.longitude,
      model: 'Cock',
      systemName: 'android',
      systemVersion: '11',
      userId: this.user.username,
    }

    // Hack to ensure signHashBody is alphabet-ordered
    const signExtensionBody: SignExtensionBody & { bodyString: undefined } = {
      ...signHashBody,
      bodyString: undefined,
    }

    const signHash = crypto
      .createHash('md5')
      .update(
        `${
          new URLSearchParams(signHashBody as any).toString()
        }&${CheckIn.FORMBODY_ENCRYPT.key}`,
      )
      .digest('hex')

    const postBody: PostFormBody = {
      sign: signHash,
      version: CheckIn.VERSION.version,
      calVersion: CheckIn.VERSION.calVersion,
      ...signHashBody,
    }

    headers['Cpdaily-Extension'] = CheckIn.extensionEncrypt(signExtensionBody)
    res = await fetch(
      `${school.campusphere}${CampusphereEndpoint.submitSign}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify(postBody),
      },
    )
    const result = (await res.json()) as any

    const logInfo: LogInfo = {
      [LogInfoKeys.result]: result.message,
      [LogInfoKeys.addr]: formBody.position,
    }

    // Hide sensitive info on github actions, cause it's public by default
    if (process.env.GITHUB_ACTION) {
      delete logInfo[LogInfoKeys.addr]
    }

    // store result
    return logInfo
  }

  private static fixedFloatRight(floatStr: string): number {
    return parseFloat(
      floatStr.replace(
        /(\d+\.\d{5})(\d{1})(.*)/,
        (s, p, p2) => `${p}${p2 == 0 ? 1 : p2}`,
      ),
    )
  }

  // select right item with content&wid
  private static fillExtra(
    extraField: SignTaskDetail['extraField'],
  ): SignFormBody['extraFieldItems'] {
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

  private static extensionEncrypt(body: SignExtensionBody): string {
    const { algo, key, iv } = CheckIn.EXTENSION_ENCRYPT
    const cipher = crypto.createCipheriv(algo, key, iv)
    let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }

  private static formBodyEncrypt(body: SignFormBody): string {
    const { algo, key, iv } = CheckIn.FORMBODY_ENCRYPT
    const cipher = crypto.createCipheriv(algo, key, iv)
    let encrypted = cipher.update(JSON.stringify(body), 'utf8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
  }
}

export async function checkIn() {
  // Get cookie
  await handleCookie()
  // Grab users
  const users = sstore.get('users')
  if (users?.length) {
    // Sign in
    const logs = await signIn(users)
    // Log out results
    if (logs) {
      console.table(logs)
    }
  }
}

async function signIn(
  users: UsersConf['users'],
): Promise<GlobalLogInfo | null> {
  // Sign in asynchronizedly with promise all and diff instance of signApp class

  const logs: GlobalLogInfo = {}
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
            [LogInfoKeys.result as string]: `已完成：${
              curTask.signedTasks[0].taskName
            }`,
          }
        }
      }
    }),
  )
  log.notify(`签到结果 => \n${JSON.stringify(logs, null, '  ')}`)
  return Object.keys(logs).length ? logs : null
}
