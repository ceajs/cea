import { CookieRawObject } from './cookie'
export { EdgeCasesSchools, DefaultProps } from '../src/compatibility/edge-case'

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
  // ampUrl 1 or 2
  swms: string
  // `${compusphere.origin}/iap/login?service=${encodeURIComponent(`${campusphere}/portal/login`)}`
  loginStartEndpoint: string
  chineseName: string
  isIap: boolean
}
