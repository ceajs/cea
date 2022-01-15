export type SignTaskPerDay = {
  [key in 'unSignedTasks' | 'signedTasks' | 'leaveTasks']: Array<SignTask>
  
} & {
  dayInMonth: string
}

export type SignTaskInMonth = {
  rows: Array<SignTaskPerDay>
}

export type SignTask = {
  [K in 'signInstanceWid' | 'signWid' | 'taskName']: string
}

export type SignTaskDetail = {
  isMalposition: 1 | 0
  isPhoto: boolean
  longitude: string
  signAddress: string
  latitude: string
  isNeedExtra: string
  signPlaceSelected: Array<{ longitude: string; latitude: string }>
  signedStuInfo: { userName: string }
  extraField?: Array<{
    title?: string
    extraFieldItems: Array<{
      isAbnormal: boolean
      isSelected: boolean
      wid: string
      content: string
      value: string
    }>
  }>
  signPhotoUrl?: string
}

/**用于记录签到表单的对象 */
export type SignFormBody = {
  signInstanceWid: string
  longitude: number
  latitude: number
  isNeedExtra: string
  abnormalReason: string
  signPhotoUrl: string
  position: string
  extraFieldItems?: Array<{
    extraFieldItemWid: string
    extraFieldItemValue: string
  }>
  uaIsCpadaily: true
  isMalposition: 1 | 0
}

/**用于提交签到的对象 */
export type PostFormBody = {
  /**由 SignHashBody 序列字符 MD5 Hash 处理得到*/
  sign: string
  /**版本号:来源未知 */
  calVersion: string
  /**版本号:来源未知 */
  version: string
  /**应用版本 */
  appVersion: string
  /**加密后的 SignFormBody */
  bodyString: string
  /**设备唯一标识符 */
  deviceId: string
  /**签到维度 */
  lat: number
  /**签到经度 */
  lon: number
  /**手机型号 */
  model: string
  /**手机系统名 */
  systemName: string
  /**手机系统版本 */
  systemVersion: string
  /**用户学号 */
  userId: string
}
/**用于构造 Sign Hash 字符的对象*/
export type SignHashBody = Omit<PostFormBody, 'sign' | 'calVersion' | 'version'>
/**用于构造 Cpdaily_Extension Header 字符的对象 */
export type SignExtensionBody = Omit<SignHashBody, 'bodyString'>

export enum LogInfoKeys {
  result = '签到结果',
  addr = '签到地址',
}

export type LogInfo = {
  [K in LogInfoKeys]?: string
}

export type GlobalLogInfo = { [key: string]: LogInfo }
