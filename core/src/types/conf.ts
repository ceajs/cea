export type UsersConf = {
  notifier?: [`${number}`, string]
  users: Array<UserConfOpts>
}
export type UserConfOpts = {
  username: string
  password: string
  captcha?: 'OCR'
  alias: string
  school: string
  addr: Array<string>
}

export type SchoolConf = {
  [school: string]: SchoolConfOpts
}

export type SchoolConfOpts = {
  // idsUrl
  campusphere: string
  // `${compusphere.origin}/iap/login?service=${encodeURIComponent(`${campusphere}/portal/login`)}`
  preAuthURL: string
  authURL?: string
  chineseName: string
  defaultAddr: string
  isCloud: boolean
  auth: string
}
