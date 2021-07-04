import { Headers } from 'node-fetch'
import { CookieMap } from '../types/cookie'

/**
 * Parse http response headers' cookie
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
    if (!keyVal) {
      continue
    }
    const [key, val] = keyVal.split('=')
    const domainVal = optionals.find((e) => e.includes('Domain'))

    // set root domain cookie
    if (domainVal) {
      const [_, domain] = domainVal.split('=')
      map.set(domain, new Map([[key, val]]))
    }

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
 * Construct a cookie object based on host
 */
export function cookieStr(host: string, cookieMap: CookieMap) {
  let str = ''
  const mapIdx = host
  const cookie = cookieMap.get(mapIdx)
  const rootCookie = cookieMap.get(mapIdx.replace(/\w+\./, ''))

  if (cookie) {
    for (const [key, value] of cookie.entries()) {
      str += `${key}=${value}; `
    }
  }

  if (rootCookie) {
    for (const [key, value] of rootCookie.entries()) {
      str += `${key}=${value}; `
    }
  }

  return str
}
