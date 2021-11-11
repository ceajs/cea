export type UnifiedLoginResult = {
  resultCode: keyof typeof UnifiedLoginResultCodeMsg
  needCaptcha: boolean
}

export enum UnifiedLoginResultCodeMsg {
  CAPTCHA_NOTMATCH = '验证码不匹配',
  FAIL_UPNOTMATCH = '账户名或密码有误',
}
