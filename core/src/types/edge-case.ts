export type SchoolEdgeCase = {
  getLtPath: '/security/lt'
  getCaptchaPath: '/generateCaptcha'
  submitCaptchakey: 'captcha'
} & {
  getCaptchaPath: string
  checkCaptchaPath: string
  verifySliderCaptchaPath?: string
  sliderCanvasLength?: number
  formIdx: number
  pwdEncrypt: boolean
}
