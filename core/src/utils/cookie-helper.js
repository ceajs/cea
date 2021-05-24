"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieStr = exports.cookieParse = void 0;
function cookieParse(host, headers) {
    const rawCookies = headers.raw()['set-cookie'];
    const map = new Map();
    if (!rawCookies) {
        return map;
    }
    let [lastIdxMark, arr] = ['', []];
    for (const e of rawCookies) {
        const [_, keyVal, path] = e.match(/(.*);(?:\s?)path=((\w+|\/)*)/i);
        if (!keyVal) {
            continue;
        }
        const [key, val] = keyVal.split('=');
        const mapIdx = `${host}::${path}`;
        if (lastIdxMark !== mapIdx) {
            if (lastIdxMark) {
                map.set(lastIdxMark, arr);
                arr = [];
            }
        }
        lastIdxMark = mapIdx;
        arr.push([key, val]);
    }
    if (arr.length) {
        map.set(lastIdxMark, arr);
    }
    return map;
}
exports.cookieParse = cookieParse;
function cookieStr(host, path, cookieMap) {
    const mapIdx = `${host}::${path}`;
    const cookie = cookieMap.get(mapIdx);
    if (cookie) {
        return cookie.reduce((str, e) => {
            const [key, val] = e;
            return str + `${key}=${val}; `;
        }, '');
    }
}
exports.cookieStr = cookieStr;
//# sourceMappingURL=cookie-helper.js.map