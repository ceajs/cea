export type SchoolEdgeCase = {
  getLtPath: '/security/lt'
  getCaptchaPath: '/generateCaptcha'
  submitCaptchakey: 'captcha'
} & {
  getCaptchaPath: string
  checkCaptchaPath: string
  formIdx: number
  pwdEncrypt: boolean
}
