import fetch from 'node-fetch'
import { cookieParse, cookieStr } from './cookie-helper.js'

import type { Response } from 'node-fetch'
import type { CookieMap, FetchCookieOptions } from '../types/cookie'
import type { StringKV } from '../types/helper'

/**
 * Node-fetch wrapper for contantly cookie handling
 */
export default class FetchWithCookie {
  private headers: StringKV
  private cookieMap?: CookieMap
  private lastRes?: Response
  private referer?: string
  lastRedirectUrl?: string
  redirectUrl?: string
  constructor(headers: StringKV) {
    this.headers = headers
  }

  async get(url: string, options = {}): Promise<Response> {
    return await this.fetch(url, options)
  }

  async post(url: string, options: FetchCookieOptions): Promise<Response> {
    options.isPost = true
    return await this.fetch(url, options)
  }

  async follow(options?: FetchCookieOptions): Promise<Response> {
    let res: Response
    if (this.redirectUrl) {
      res = await this.fetch(this.redirectUrl, options || {})
      await this.follow(options || {})
    }
    res = this.lastRes!

    return new Promise((resolve) => resolve(res))
  }

  private async fetch(url: string, options: FetchCookieOptions) {
    const { host, origin } = new URL(url)
    const { type, body } = options
    const { headers } = this

    headers.origin = origin
    headers.referer = this.redirectUrl ?? origin
    headers.host = host
    headers.cookie = this.cookieMap ? cookieStr(host, this.cookieMap)! : ''

    headers['Content-Type'] = type === 'form'
      ? 'application/x-www-form-urlencoded'
      : 'application/json'

    if (!type && headers['Content-Type']) {
      Reflect.deleteProperty(headers, 'Content-Type')
    }

    const res = (await fetch(url, {
      headers,
      method: type ? 'POST' : undefined,
      body: body,
      redirect: 'manual',
    }).catch(console.error)) as Response

    this.lastRedirectUrl = this.redirectUrl
    this.redirectUrl = res.headers.get('location') || undefined
    this.lastRes = res
    this.referer = url
    this.updateMap(cookieParse(host, res.headers))
    return res
  }

  getCookieObj() {
    let obj: StringKV = {}
    for (const [key, val] of this.cookieMap!.entries()) {
      // ignore cookie path, lower complexity
      obj[key] = [...val].reduce((str, e) => `${str}${e.join('=')}; `, '')
    }
    return obj
  }

  private updateMap(newMap: CookieMap) {
    if (!this.cookieMap) {
      this.cookieMap = newMap
    } else {
      for (const [key, val] of newMap.entries()) {
        const oldVal = this.cookieMap.get(key)
        this.cookieMap.set(key, new Map(oldVal ? [...val, ...oldVal] : val))
      }
    }
  }
}
