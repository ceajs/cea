import { CookieRawObject } from './cookie'
export { DefaultProps, EdgeCasesSchools } from '../compatibility/edge-case'

export type UsersConf = Array<UserConfOpts>

export type UserConfOpts = {
  username: string
  password: string
  alias: string
  school: string
  addr: Array<string>
  cookie?: CookieRawObject
}

export type SchoolConf = {
  [school: string]: SchoolConfOpts
}

export type SchoolConfOpts = {
  // idsUrl
  campusphere: string
  // `${compusphere.origin}/iap/login?service=${encodeURIComponent(`${campusphere}/portal/login`)}`
  campusAuthStartEndpoint: string
  chineseName: string
  defaultAddr: string
  isIap: boolean
  auth: string
}
