import fetch from 'node-fetch'
import { CookieMap, FetchCookieOptions } from '../types/cookie'
import { cookieParse, cookieStr } from './cookie-helper'
import { Response } from 'node-fetch'
import { AnyObject } from '../types/helper'

export class FetchWithCookie {
  private headers: AnyObject
  private cookieMap?: CookieMap
  private redirectUrl?: string
  constructor(headers: AnyObject) {
    this.headers = headers
    this.cookieMap = undefined
    this.redirectUrl = undefined
  }

  async get(url: string, options = {}): Promise<Response> {
    return await this.fetch(url, options)
  }

  async post(url: string, options: FetchCookieOptions): Promise<Response> {
    options.isPost = true
    return await this.fetch(url, options)
  }

  /**
   * keep requesting last request url
   * @param {} options
   */
  async follow(options?: FetchCookieOptions): Promise<Response> {
    return new Promise((resolve, reject) =>
      this.redirectUrl
        ? resolve(this.fetch(this.redirectUrl, options || {}))
        : reject({ status: 555 })
    )
  }

  async fetch(url: string, options: FetchCookieOptions) {
    const { host, origin } = new URL(url)
    const { type, body, cookiePath } = options
    const { headers } = this

    headers.origin = origin
    headers.referer = origin
    headers.host = host
    headers.cookie = this.cookieMap
      ? cookieStr(host, cookiePath!, this.cookieMap)!
      : ''

    headers['Content-Type'] =
      type === 'form' ? 'application/x-www-form-urlencoded' : 'application/json'

    if (!type && headers['Content-Type']) {
      delete headers['Content-Type']
    }

    const res = (await fetch(url, {
      headers,
      method: type ? 'POST' : undefined,
      body: body,
      redirect: 'manual',
    }).catch((err) => console.error(err))) as Response

    this.redirectUrl = res.headers.get('location') || this.redirectUrl
    this.updateMap(cookieParse(host, res.headers))
    return res
  }

  getCookieObj() {
    let obj: AnyObject = {}
    for (const [key, val] of this.cookieMap!.entries()) {
      const [_, feild, path] = key.match(/(.*)(::.*)/)!
      obj[`${feild.includes('campusphere') ? 'campusphere' : 'swms'}${path}`] =
        val.reduce((str, e) => `${str}${e.join('=')}; `, '')
    }
    return obj
  }

  updateMap(newMap: CookieMap) {
    if (!this.cookieMap) {
      this.cookieMap = newMap
    } else {
      for (const [key, val] of newMap.entries()) {
        const old = this.cookieMap ? this.cookieMap.get(key) : []
        if (old) {
          this.cookieMap.set(key, [...old, ...val])
        } else {
          this.cookieMap.set(key, val)
        }
      }
    }
  }
}
