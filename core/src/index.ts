import fetch from 'node-fetch'
import login from './crawler/login'

import { SchoolConf, UserConfOpts } from './types/conf'
import { CookieRawObject } from './types/cookie'
import log from './utils/logger'

// sstore
export const sstore = require('@beetcb/sstore')

// all the type definations for plugin & cli use
export * from './types/conf'
export * from './types/cookie'
export * from './types/helper'

// methods for configuration
export * from './conf'

// log utils for plugin & cli use
export { log }

export async function handleCookie() {
  await Promise.all(
    sstore.get('users').map(async (i: UserConfOpts) => {
      const storeCookiePath = `cookie.${i.alias}`
      await handleLogin(i, storeCookiePath)
    }),
  )
}

async function handleLogin(i: UserConfOpts, storeCookiePath: string) {
  let cookie: CookieRawObject = sstore.get(storeCookiePath)
  const name = i.alias
  const school = (sstore.get('schools') as SchoolConf)[i.school]
  // Check if the cookie is stored, if not, login in to eat them
  if (!cookie) {
    const result = await login(school, i)
    if (result) {
      sstore.set(storeCookiePath, result)
      log.success({
        message: `已成功获取并缓存 COOKIE`,
        suffix: `@${name}`,
      })
    }
  } else {
    // Check if the cookie is valid
    const test = await fetch(school.campusphere + '/portal/login', {
      headers: {
        cookie: cookie['campusphere::/'],
      },
    })
    if (test.headers.get('set-cookie')) {
      // invaild cookie
      log.warn({
        message: `COOKIE 失效，准备刷新`,
        suffix: `@${name}`,
      })
      sstore.del(storeCookiePath)
      await handleLogin(i, storeCookiePath)
    }
    log.success({
      message: `尝试使用缓存中的 COOKIE`,
      suffix: `@${name}`,
    })
  }
}
