import sstore from '@beetcb/sstore'
import fetch from 'node-fetch'
import login from './crawler/login.js'
import log from './utils/logger.js'

import type { SchoolConf, UserConfOpts } from './types/conf'
import type { CookieRawObject, HandleCookieOptions } from './types/cookie'
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
export type { CookieRawObject, HandleCookieOptions, StringKV }
export { CampusphereEndpoint } from './types/helper.js'

/**
 * Iterate through all users: complete unified auth -> store cookie
 */
export async function handleCookie(options?: HandleCookieOptions) {
  try {
    await Promise.all(
      sstore.get('users').map(async (i: UserConfOpts) => {
        const storeCookiePath = `cookie.${i.alias}`
        await handleLogin(i, storeCookiePath, options || {})
      }),
    )
  } catch (error: any) {
    if (
      error.message == "Cannot read properties of undefined (reading 'map')"
    ) {
      log.error({
        message: '请先加载用户',
      })
    } else {
      throw error
    }
  }
  /* 未加载用户执行sign 会报错

  file:///root/cea/core/lib/src/index.js:11
  await Promise.all(sstore.get("users").map(async (i) => {
                                       ^

TypeError: Cannot read properties of undefined (reading 'map')
    at handleCookie (file:///root/cea/core/lib/src/index.js:11:40)
    at checkIn (file:///root/cea/plugins/check-in/lib/src/index.js:162:9)
    at file:///root/cea/internal/lib/src/cli.js:26:13
    at file:///root/cea/internal/lib/src/cli.js:47:3
    at ModuleJob.run (node:internal/modules/esm/module_job:185:25)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:281:24)
    at async loadESM (node:internal/process/esm_loader:88:5)
    at async handleMainPromise (node:internal/modules/run_main:65:12)

    */
}

async function handleLogin(
  i: UserConfOpts,
  storeCookiePath: string,
  options: HandleCookieOptions,
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
