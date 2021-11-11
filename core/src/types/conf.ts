export type UsersConf = {
  readonly notifier?: [`${number}`, string]
  readonly users: Array<UserConfOpts>
}
export type UserConfOpts = {
  readonly username: string
  readonly password: string
  readonly captcha?: 'MANUAL' | 'OCR'
  readonly alias: string
  readonly school: string
  addr: Array<string>
}

export type SchoolConf = {
  [school: string]: SchoolConfOpts
}

export type SchoolConfOpts = {
  // idsUrl
  readonly campusphere: string
  // `${compusphere.origin}/iap/login?service=${encodeURIComponent(`${campusphere}/portal/login`)}`
  readonly preAuthURL: string
  readonly authURL?: string
  readonly chineseName: string
  readonly defaultAddr: string
  readonly isCloud: boolean
  readonly auth: string
}
