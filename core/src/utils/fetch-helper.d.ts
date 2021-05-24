import { CookieMap, FetchCookieOptions } from '../types/cookie';
import { Response } from 'node-fetch';
import { StringKV } from '../types/helper';
export declare class FetchWithCookie {
    private headers;
    private cookieMap?;
    private redirectUrl?;
    constructor(headers: StringKV);
    get(url: string, options?: {}): Promise<Response>;
    post(url: string, options: FetchCookieOptions): Promise<Response>;
    follow(options?: FetchCookieOptions): Promise<Response>;
    fetch(url: string, options: FetchCookieOptions): Promise<Response>;
    getCookieObj(): StringKV;
    updateMap(newMap: CookieMap): void;
}
