export type CookieMap = Map<string, Map<string, string>>

export type CookieRawObject = {
  [K: string]: string
}

export interface FetchCookieOptions {
  type?: 'json' | 'form'
  cookiePath?: string
  body?: string
  isPost?: boolean
}
