import { Headers } from 'node-fetch'
import { CookieMap } from '../types/cookie'

/**
 * Parse http response headers
 */
export function cookieParse(host: string, headers: Headers): CookieMap {
  const rawCookies = headers.raw()['set-cookie']
  const map = new Map()
  if (!rawCookies) {
    return map
  }

  let [lastIdxMark, kv] = ['', new Map()] as [string, Map<string, string>]
  for (const e of rawCookies) {
    const [keyVal, ...optionals] = e.split('; ')
    const [_, path] = optionals
      .find((value) => value.match(/path/i))!
      .split('=')
    if (!keyVal) {
      continue
    }
    const [key, val] = keyVal.split('=')
    const mapIdx = host
    if (lastIdxMark !== mapIdx) {
      if (lastIdxMark) {
        map.set(lastIdxMark, kv)
        kv = new Map()
      }
    }
    lastIdxMark = mapIdx
    kv.set(key, val)
    // deprecated because of the numerous map set operations
    // map.set(mapIdx, [...(ownedKeyVal ? ownedKeyVal : []), { [key]: val }])
  }
  if (kv.size) {
    map.set(lastIdxMark, kv)
  }
  return map
}

/**
 * Construct a cookie obj base on path
 */
export function cookieStr(host: string, cookieMap: CookieMap) {
  let str = ''
  const mapIdx = host
  const cookie = cookieMap.get(mapIdx)

  if (cookie) {
    for (const [key, value] of cookie.entries()) {
      str += `${key}=${value}; `
    }
  }

  return str
}
