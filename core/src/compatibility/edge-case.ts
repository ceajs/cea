const schoolEdgeCases = {
  宁波大学: {
    formIdx: 0,
    rememberMe: 'on',
    cookiePath: '/',
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/captcha.html',
  },
}

// we will using proxy to get the default properties
const defaultProps = {
  rememberMe: true,
  getCaptchaPath: '/getCaptcha.htl',
  checkCaptchaPath: '/checkNeedCaptcha.htl',
  cookiePath: '/authserver',
  formIdx: 2,
  pwdEncrypt: true,
}

const iapDefaultProps = {
  lt: '/security/lt',
  rememberMe: true,
  checkCaptchaPath: '/checkNeedCaptcha',
  getCaptchaPath: '/generateCaptcha',
}

export type EdgeCasesSchools = keyof typeof schoolEdgeCases
type NoIapDefaultProps = typeof defaultProps
type IapDefaultProps = typeof iapDefaultProps

export type DefaultProps = NoIapDefaultProps & IapDefaultProps

/**
 * handle edge cases, proxy default properties
 */
export default (schoolName: EdgeCasesSchools, isIap: boolean) =>
  schoolName
    ? (new Proxy(schoolEdgeCases[schoolName] || {}, {
      get(target, prop, receiver) {
        if (
          target[prop as keyof NoIapDefaultProps & keyof IapDefaultProps]
            === undefined
        ) {
          return isIap
            ? iapDefaultProps[prop as keyof IapDefaultProps]
            : defaultProps[prop as keyof NoIapDefaultProps]
        }
        return Reflect.get(target, prop, receiver)
      },
    }) as unknown as DefaultProps)
    : ({} as DefaultProps)
