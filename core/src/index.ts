import fetch from 'node-fetch'
import login from './crawler/login'

import { SchoolConf, UserConfOpts } from './types/conf'
import { CookieRawObject, handleCookieOptions } from './types/cookie'

import log from './utils/logger'
export * from './utils/cookie-helper'

// sstore
import sstore from '@beetcb/sstore'

// all the type definations for plugin & cli use
export * from './types/conf'
export * from './types/cookie'
export * from './types/helper'

// methods for configuration
export * from './conf'

// log utils for plugin & cli use
export { log }
// export database
export { sstore }
export { handleCookieOptions }

/**
 * Iterate through all users: complete unified auth -> store cookie
 */
export async function handleCookie(options?: handleCookieOptions) {
  await Promise.all(
    sstore.get('users').map(async (i: UserConfOpts) => {
      const storeCookiePath = `cookie.${i.alias}`
      await handleLogin(i, storeCookiePath, options || {})
    }),
  )
}

async function handleLogin(
  i: UserConfOpts,
  storeCookiePath: string,
  options: handleCookieOptions,
) {
  let cookie: CookieRawObject = sstore.get(storeCookiePath)
  const name = i.alias
  const school = (sstore.get('schools') as SchoolConf)[i.school]
  // Check if the cookie is stored, if not, login in to eat them
  if (!cookie) {
    const result = await login(school, i, options)
    if (result) {
      sstore.set(storeCookiePath, result)
      log.success({
        message: `已成功获取并缓存 COOKIE`,
        suffix: `@${name}`,
      })
    }
  } else {
    const authCookieIdx = new URL(school.auth).host
    // check if the cookie is valid
    const test = await fetch(`${school.auth}/login`, {
      headers: {
        cookie: cookie[authCookieIdx],
      },
      redirect: 'manual',
    })
    if (test.headers.get('set-cookie')) {
      // invaild cookie
      log.warn({
        message: `COOKIE 失效，准备刷新`,
        suffix: `@${name}`,
      })
      sstore.del(storeCookiePath)
      await handleLogin(i, storeCookiePath, options)
    }
    log.success({
      message: `尝试使用缓存中的 COOKIE`,
      suffix: `@${name}`,
    })
  }
}
