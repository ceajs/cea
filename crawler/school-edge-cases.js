// @ts-check
const schoolEdgeCases = {
  武汉轻工大学: {
    formIdx: 2,
    checkCaptchaPath: '/checkNeedCaptcha.htl',
    getCaptchaPath: '/getCaptcha.htl',
  },
  宁波大学: {
    rememberMe: 'on',
  },
}

// we will using proxy to get the default properties
const defaultProps = {
  rememberMe: true,
  checkCaptchaPath: '/needCaptcha.html',
  getCaptchaPath: '/captcha.html',
  formIdx: 0,
  pwdEncrypt: true,
}

const iapDefaultProps = {
  lt: '/security/lt',
  rememberMe: true,
  checkCaptchaPath: '/checkNeedCaptcha',
  getCaptchaPath: '/generateCaptcha',
}

/**
 * handle edge cases, proxy default properties
 * @param {string} schoolName
 * @param {boolean} isIap
 */
module.exports = (schoolName, isIap) =>
  schoolName
    ? new Proxy(schoolEdgeCases[schoolName] || {}, {
        get(target, prop, receiver) {
          if (target[prop] === undefined) {
            return isIap ? iapDefaultProps[prop] : defaultProps[prop]
          }
          return Reflect.get(target, prop, receiver)
        },
      })
    : {}
