import crypto from 'crypto'

import { log, sstore } from '@ceajs/core'
import fetch from 'node-fetch'
import * as uuid from 'uuid'
import { CampusphereEndpoint } from './constant.js'
import { LogInfoKeys, PostFormBody, SignTaskInMonth } from './types.js'

import type {
  CookieRawObject,
  SchoolConfOpts,
  StringKV,
  UserConfOpts,
  UsersConf,
} from '@ceajs/core'
import type {
  GlobalLogInfo,
  LogInfo,
  SignExtensionBody,
  SignFormBody,
  SignHashBody,
  SignTask,
  SignTaskDetail,
  SignTaskPerDay,
} from './types'

type CheckInType = keyof typeof CampusphereEndpoint

/**
 * Universal Check In helper for `sign` | `attendance`
 */
export class CheckIn {
  static readonly VERSION = {
    app: '9.0.18',
    version: 'first_v3',
    calVersion: 'firstv',
  }
  static readonly EXTENSION_ENCRYPT = {
    key: 'XCE927==',
    iv: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]),
    algo: 'des-cbc',
  }
  static readonly FORMBODY_ENCRYPT = {
    key: 'SASEoK4Pa5d4SssO',
    iv: Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7]),
    algo: 'aes-128-cbc',
  }

  private headers: StringKV
  private user: UserConfOpts
  private school: SchoolConfOpts
  private readonly campusphereHost: string
  private readonly checkInType: CheckInType
  constructor(user: UserConfOpts, checkInType: CheckInType) {
    const school = sstore.get('schools')[user.school]
    this.school = school
    this.user = user
    this.campusphereHost = new URL(school.preAuthURL).origin
    this.checkInType = checkInType
    this.headers = {
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
      'content-type': 'application/json',
    }
  }

  async signInfo(): Promise<SignTaskPerDay | void> {
    const { user, checkInType, campusphereHost } = this
    const storeCookiePath = `cookie.${user.alias}`
    const cookie: CookieRawObject = sstore.get(storeCookiePath)

    const campusCookieIdx = new URL(campusphereHost).host
    if (!cookie) {
      return
    }
    this.headers.cookie = cookie[campusCookieIdx]
    const res = await fetch(
      `${campusphereHost}${CampusphereEndpoint[checkInType].tasksToday}`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({}),
      }
    )

    if (res.headers.get('content-type')?.includes('json')) {
      const signQ = (await res.json()) as {
        datas: SignTaskPerDay
        message: string
      }
      const isValidCookie = signQ.message === 'SUCCESS'
      if (isValidCookie) {
        return signQ.datas
      }
    }
  }

  /**
   * Cookie is preconfigured by singInfo method
   */
  async signWithForm(curTask: SignTask): Promise<LogInfo> {
    const { school, headers, checkInType, campusphereHost } = this
    const { signInstanceWid, signWid } = curTask
    let res = await fetch(
      `${campusphereHost}${CampusphereEndpoint[checkInType].taskDetails}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify({ signInstanceWid, signWid }),
      }
    )
    const signDetails: SignTaskDetail = ((await res.json()) as any).datas

    const {
      extraField,
      signPlaceSelected,
      isNeedExtra,
      isPhoto,
      isMalposition,
    } = signDetails

    const placeList = signPlaceSelected[0]
    const customAddr = this.user.addr

    let signedTemplate =
      isPhoto || isNeedExtra ? await this.grabSignedData() : undefined

    // Need signedData but we failed to retrieve it
    if (signedTemplate === null) {
      return {
        [LogInfoKeys.result]:
          '无法获取历史签到数据作为模板，请检查 signedDataMonth 配置',
      }
    }

    const [longitude, latitude, position] =
      customAddr.length === 3
        ? customAddr
        : [placeList.longitude, placeList.latitude, school.defaultAddr]

    // Find the right photo in the signed-in tasks
    const signPhotoUrl = isPhoto ? signedTemplate?.signPhotoUrl ?? '' : ''

    // Auto-fill extraFieldItems
    const autoFillExtra = CheckIn.fillExtra(extraField!, signedTemplate!)
    if (autoFillExtra === null) {
      return {
        [LogInfoKeys.result]:
          '当前表单与模板表单不匹配，放弃签到',
      }
    }
    const extraFieldItems = isNeedExtra
      ? autoFillExtra
      : undefined

    const formBody: SignFormBody = {
      longitude: CheckIn.fixedFloatRight(longitude),
      latitude: CheckIn.fixedFloatRight(latitude),
      abnormalReason: '',
      uaIsCpadaily: true,
      isMalposition,
      signPhotoUrl,
      isNeedExtra,
      position,
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
        `${new URLSearchParams(signHashBody as any).toString()}&${CheckIn.FORMBODY_ENCRYPT.key
        }`
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
      `${campusphereHost}${CampusphereEndpoint[checkInType].submitSign}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify(postBody),
      }
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

  async signTaskDetails(task: SignTask) {
    const { headers, checkInType, campusphereHost } = this
    const { signInstanceWid, signWid } = task
    let res = await fetch(
      `${campusphereHost}${CampusphereEndpoint[checkInType].taskDetails}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify({ signInstanceWid, signWid }),
      }
    )
    const signDetails: SignTaskDetail = (await res.json()).datas
    return signDetails
  }

  async grabSignedData() {
    const { headers, user, checkInType, campusphereHost } = this
    let res = await fetch(
      `${campusphereHost}${CampusphereEndpoint[checkInType].tasksInMonth}`,
      {
        headers,
        method: 'POST',
        body: JSON.stringify({
          statisticYearMonth: user?.signedDataMonth ?? CheckIn.getLatestValidDateMonth(),
        }),
      }
    )
    const tasksInMonth = (await res.json())?.datas as SignTaskInMonth
    if (tasksInMonth?.rows.length) {
      // Find valid sign data reversly(sort by date info)
      const signedTaskDay = tasksInMonth.rows
        .sort((a, b) => (a.dayInMonth > b.dayInMonth ? -1 : 1))
        .find((row) => row.signedTasks.length)
      if (signedTaskDay) {
        const { signedTasks } = signedTaskDay
        const signInstance = signedTasks?.[0]
        if (signInstance) {
          const taskDetail = await this.signTaskDetails(signInstance)
          return taskDetail
        }
      } else {
        return null
      }
    }
    return null
  }

  private static getLatestValidDateMonth() {
    const curDate = new Date()
    const isFirstDay = curDate.getDate() === 1
    const isFirstMonth = curDate.getMonth() === 0
    const isFirstDayAndMonth = isFirstDay && isFirstMonth
    const latestValidDateMonth = `${curDate.getFullYear() + (isFirstDayAndMonth ? -1 : 0)}-${(curDate.getMonth() + (isFirstDayAndMonth ? 12 : isFirstDay ? 0 : 1))
      .toString().padStart(2, '0')}`
    return latestValidDateMonth
  }

  private static fixedFloatRight(floatStr: string): number {
    return parseFloat(
      floatStr.replace(
        /(\d+\.\d{5})(\d{1})(.*)/,
        (s, p, p2) => `${p}${p2 == 0 ? 1 : p2}`
      )
    )
  }

  // Select right item with content&wid
  private static fillExtra(
    extraField: NonNullable<SignTaskDetail['extraField']>,
    signedTemplate: SignTaskDetail
  ): SignFormBody['extraFieldItems'] | null {
    const signedExtraField = signedTemplate.extraField!
    const isSignedTemplateMatch = signedExtraField.every((ele, idx) => ele.title === extraField[idx]?.title
    )

    return isSignedTemplateMatch ? extraField.map((ele, idx) => {
      let chosenWid: string
      const curSignedExtraField = signedExtraField[idx]
      const signedSelectedItemValue = curSignedExtraField.extraFieldItems.find(
        (e) => e.isSelected === true
      )!.value
      const normal = ele.extraFieldItems.find((e) => {
        if (isSignedTemplateMatch) {
          if (signedSelectedItemValue === e.content) {
            chosenWid = e.wid
            return true
          }
        } else {
          if (e.isAbnormal === false) {
            chosenWid = e.wid
            return true
          }
        }
      })
      return {
        extraFieldItemWid: chosenWid!,
        extraFieldItemValue: normal!.content,
      }
    }) : null
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

  static async signIn(
    users: UsersConf['users'],
    checkInType: CheckInType
  ): Promise<GlobalLogInfo | null> {
    // Sign in asynchronizedly with promise all and diff instance of signApp class
    const logs: GlobalLogInfo = {}
    await Promise.all(
      users.map(async (i) => {
        const instance: CheckIn = new CheckIn(i, checkInType)
        const curTask = await instance.signInfo()
        if (curTask) {
          const needCheckInTasks = curTask.signedTasks.concat(
            curTask.leaveTasks
          )
          if (needCheckInTasks.length) {
            const result = await instance.signWithForm(needCheckInTasks[0])
            logs[i.alias] = result
          } else {
            const { signedTasks } = curTask
            logs[i.alias] = {
              [LogInfoKeys.result as string]: signedTasks.length
                ? `已完成：${curTask.signedTasks[0]?.taskName}`
                : '当前无签到任务',
            }
          }
        }
      })
    )
    log.notify(`签到结果 => \n${JSON.stringify(logs, null, '  ')}`)
    return Object.keys(logs).length ? logs : null
  }
}
