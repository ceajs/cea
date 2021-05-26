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

  let [lastIdxMark, arr] = ['', []] as [string, Array<Array<string>>]
  for (const e of rawCookies) {
    const [_, keyVal, path] = e.match(/(.*);(?:\s?)path=((\w+|\/)*)/i)!
    if (!keyVal) {
      continue
    }
    const [key, val] = keyVal.split('=')
    const mapIdx = `${host}::${path}`
    if (lastIdxMark !== mapIdx) {
      if (lastIdxMark) {
        map.set(lastIdxMark, arr)
        arr = []
      }
    }
    lastIdxMark = mapIdx
    arr.push([key, val])
    // deprecated because of the numerous map set operations
    // map.set(mapIdx, [...(ownedKeyVal ? ownedKeyVal : []), { [key]: val }])
  }
  if (arr.length) {
    map.set(lastIdxMark, arr)
  }
  return map
}

/**
 * Construct a cookie obj base on path
 */
export function cookieStr(host: string, path: string, cookieMap: CookieMap) {
  const mapIdx = `${host}::${path}`
  const cookie = cookieMap.get(mapIdx)
  if (cookie) {
    return cookie.reduce((str, e) => {
      const [key, val] = e
      return str + `${key}=${val}; `
    }, '')
  }
}
