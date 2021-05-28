export type AllSignTasks = {
  [key in 'unSignedTasks' | 'signedTasks' | 'leaveTasks']: Array<SignTask>
}

export type SignTask = {
  [K in 'signInstanceWid' | 'signWid' | 'taskName']: string
}

export type SignTaskDetail = {
  longitude: string
  latitude: string
  isNeedExtra: string
  signPlaceSelected: Array<{ longitude: string; latitude: string }>
  signedStuInfo: { userName: string }
  extraField: Array<{
    extraFieldItems: Array<{
      isAbnormal: boolean
      wid: string
      content: string
    }>
  }>
}

export enum LogInfoKeys {
  result = '签到结果',
  addr = '签到地址',
  name = '真实信息',
}

export type LogInfo = {
  [K in LogInfoKeys]?: string
}

export type GlobalLogInfo = { [key: string]: LogInfo }

export type SignForm = {
  signInstanceWid: string
  longitude: number
  latitude: number
  isNeedExtra: string
  abnormalReason: string
  signPhotoUrl: string
  position: string
  signVersion: '1.0.0'
  extraFieldItems: Array<{
    extraFieldItemWid: string
    extraFieldItemValue: string
  }>
  uaIsCpadaily: true
  isMalposition: 1 | 0
}

export type CpdailyExtension = {
  [
    K in
      | 'lon'
      | 'model'
      | 'appVersion'
      | 'systemVersion'
      | 'userId'
      | 'systemName'
      | 'lat'
      | 'deviceId'
  ]: string
}

export type CpdailyExtensionEncrypted = string
