export type CookieMap = Map<string, Array<[string, string]>>

export interface FetchCookieOptions {
  type?: 'json' | 'form'
  cookiePath?: string
  body?: string
  isPost?: boolean
}
