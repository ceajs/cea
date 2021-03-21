// @ts-check
const schoolEdgeCases = {
  武汉轻工大学: {
    formIdx: 2,
  },
  宁波大学: {
    checkCaptchaPath: '/needCaptcha.html',
    getCaptchaPath: '/captcha.html',
    rememberMe: 'on',
  },
}

// we will using proxy to get the default properties
const defaultProps = {
  rememberMe: true,
  checkCaptchaPath: '/checkNeedCaptcha.htl',
  getCaptchaPath: '/getCaptcha.htl',
  formIdx: 0,
  pwdEncrypt: true,
}

module.exports = (schoolName) =>
  schoolName
    ? new Proxy(schoolEdgeCases[schoolName], {
        get(target, prop, receiver) {
          if (target[prop] === undefined) {
            return defaultProps[prop]
          }
          return Reflect.get(target, prop, receiver)
        },
      })
    : {}
