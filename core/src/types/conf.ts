import type { SchoolEdgeCase } from './edge-case'

export type UsersConf = {
  readonly notifier?: [`${number}`, string, string]
  readonly users: Array<UserConfOpts>
}
export type UserConfOpts = {
  readonly username: string
  readonly password: string
  readonly alias: string
  readonly school: string
  readonly captcha?: 'MANUAL' | 'OCR'
  readonly signedDataMonth?: `${number}-${number}`
  addr: Array<string>
}

export type SchoolConf = {
  [school: string]: SchoolConfOpts
}

export type SchoolConfOpts = {
  readonly preAuthURL: string
  readonly loginURL?: string
  readonly chineseName: string
  readonly defaultAddr: string
  readonly isCloud: boolean
  readonly authOrigin: string
  readonly edgeCase: SchoolEdgeCase
}
