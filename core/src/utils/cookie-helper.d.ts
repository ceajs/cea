import { CookieMap } from '../types/cookie';
import { Headers } from 'node-fetch';
export declare function cookieParse(host: string, headers: Headers): CookieMap;
export declare function cookieStr(host: string, path: string, cookieMap: CookieMap): string | undefined;
