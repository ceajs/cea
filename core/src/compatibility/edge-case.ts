const schoolEdgeCases = {
  宁波大学: {
    formIdx: 0,
    rememberMe: 'on',
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/captcha.html',
  },
  武汉大学: {
    formIdx: 0,
    rememberMe: 'on',
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/sliderCaptcha.do',
  },
  福州大学: {
    formIdx: 0,
    rememberMe: 'on',
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/captcha.html',
    submitCaptchakey: 'captchaResponse',
  },
}

// we will using proxy to get the default properties
const defaultProps = {
  rememberMe: true,
  getCaptchaPath: '/getCaptcha.htl',
  checkCaptchaPath: '/checkNeedCaptcha.htl',
  formIdx: 2,
  pwdEncrypt: true,
}

const cloudDefaultProps = {
  lt: '/security/lt',
  rememberMe: true,
  checkCaptchaPath: '/checkNeedCaptcha',
  getCaptchaPath: '/generateCaptcha',
  submitCaptchakey: 'captcha',
}

export type EdgeCasesSchools = keyof typeof schoolEdgeCases
type NoCloudDefaultProps = typeof defaultProps
type CloudDefaultProps = typeof cloudDefaultProps

export type DefaultProps = NoCloudDefaultProps & CloudDefaultProps

/**
 * handle edge cases, proxy default properties
 */
export default (schoolName: EdgeCasesSchools, isCloud: boolean) =>
  schoolName
    ? (new Proxy(schoolEdgeCases[schoolName] || {}, {
      get(target, prop, receiver) {
        if (
          target[prop as keyof NoCloudDefaultProps & keyof CloudDefaultProps]
            === undefined
        ) {
          return isCloud
            ? cloudDefaultProps[prop as keyof CloudDefaultProps]
            : defaultProps[prop as keyof NoCloudDefaultProps]
        }
        return Reflect.get(target, prop, receiver)
      },
    }) as unknown as DefaultProps)
    : ({} as DefaultProps)
