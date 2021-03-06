import sstore from '@beetcb/sstore'
import fetch from 'node-fetch'
import login from './crawler/login.js'
import log from './utils/logger.js'

import type { SchoolConf, SchoolConfOpts, UserConfOpts } from './types/conf'
import type { CookieRawObject } from './types/cookie'
import type { StringKV } from './types/helper'

export * from './utils/cookie-helper.js'

// methods for configuration
export * from './conf.js'

// log utils for plugin & cli use
export { log }
// export database
export { sstore }

// export useful type definations for plugin & cli use
export type {
  SchoolConf,
  SchoolConfOpts,
  UserConfOpts,
  UsersConf,
} from './types/conf.js'
export type { CookieRawObject, StringKV }

/**
 * Iterate through all users: complete unified auth -> store cookie
 */
export async function handleCookie() {
  const users = sstore.get('users')
  if (users?.length) {
    await Promise.all(
      users.map(async (i: UserConfOpts) => {
        const storeCookiePath = `cookie.${i.alias}`
        await handleLogin(i, storeCookiePath)
      }),
    )
  } else {
    log.error('请先加载用户 <cea load>')
  }
}

async function loginAndStoreCookie(
  school: SchoolConfOpts,
  user: UserConfOpts,
  storeCookiePath: string,
) {
  const result = await login(school, user)
  if (result) {
    sstore.set(storeCookiePath, result)
    log.success({
      message: `已成功获取并缓存 COOKIE`,
      suffix: `@${user.alias}`,
    })
    return true
  }
  return false
}

async function handleLogin(i: UserConfOpts, storeCookiePath: string) {
  const name = i.alias
  const retryLimit = i.retry ?? 1
  const school = (sstore.get('schools') as SchoolConf)[i.school]
  // Check if the cookie is stored, if not, login to eat them
  for (let r = 0; r < retryLimit; r++) {
    const cookie: CookieRawObject = sstore.get(storeCookiePath)
    if (!cookie) {
      if (await loginAndStoreCookie(school, i, storeCookiePath)) {
        break
      }
    } else {
      const authCookieIdx = new URL(school.authOrigin).host
      // Check cookie validity
      const test = await fetch(`${school.authOrigin}/login`, {
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
        if (await loginAndStoreCookie(school, i, storeCookiePath)) {
          break
        }
      }
      log.success({
        message: `尝试使用缓存中的 COOKIE`,
        suffix: `@${name}`,
      })
      break
    }
  }
}
