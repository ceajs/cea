import type { SchoolEdgeCase } from './edge-case'

export enum CaptchaAuthMode {
  IMAGE,
  SLIDER,
}

export type UsersConf = {
  readonly notifier?: [`${number}`, string, string]
  readonly users: Array<UserConfOpts>
}
export type UserConfOpts = {
  readonly username: string
  readonly password: string
  readonly alias: string
  readonly school: string
  readonly retry?: number
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
  readonly captchaAuthMode: CaptchaAuthMode
  readonly chineseName: string
  readonly defaultAddr: string
  readonly isCloud: boolean
  readonly authOrigin: string
  readonly edgeCase: SchoolEdgeCase
}
