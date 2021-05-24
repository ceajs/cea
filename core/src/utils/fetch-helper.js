"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchWithCookie = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const cookie_helper_1 = require("./cookie-helper");
class FetchWithCookie {
    constructor(headers) {
        this.headers = headers;
        this.cookieMap = undefined;
        this.redirectUrl = undefined;
    }
    get(url, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.fetch(url, options);
        });
    }
    post(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            options.isPost = true;
            return yield this.fetch(url, options);
        });
    }
    follow(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => this.redirectUrl
                ? resolve(this.fetch(this.redirectUrl, options || {}))
                : reject({ status: 555 }));
        });
    }
    fetch(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const { host, origin } = new URL(url);
            const { type, body, cookiePath } = options;
            const { headers } = this;
            headers.origin = origin;
            headers.referer = origin;
            headers.host = host;
            headers.cookie = this.cookieMap
                ? cookie_helper_1.cookieStr(host, cookiePath, this.cookieMap)
                : '';
            headers['Content-Type'] =
                type === 'form' ? 'application/x-www-form-urlencoded' : 'application/json';
            if (!type && headers['Content-Type']) {
                delete headers['Content-Type'];
            }
            const res = (yield node_fetch_1.default(url, {
                headers,
                method: type ? 'POST' : undefined,
                body: body,
                redirect: 'manual',
            }).catch((err) => console.error(err)));
            this.redirectUrl = res.headers.get('location') || this.redirectUrl;
            this.updateMap(cookie_helper_1.cookieParse(host, res.headers));
            return res;
        });
    }
    getCookieObj() {
        let obj = {};
        for (const [key, val] of this.cookieMap.entries()) {
            const [_, feild, path] = key.match(/(.*)(::.*)/);
            obj[`${feild.includes('campusphere') ? 'campusphere' : 'swms'}${path}`] =
                val.reduce((str, e) => `${str}${e.join('=')}; `, '');
        }
        return obj;
    }
    updateMap(newMap) {
        if (!this.cookieMap) {
            this.cookieMap = newMap;
        }
        else {
            for (const [key, val] of newMap.entries()) {
                const old = this.cookieMap ? this.cookieMap.get(key) : [];
                if (old) {
                    this.cookieMap.set(key, [...old, ...val]);
                }
                else {
                    this.cookieMap.set(key, val);
                }
            }
        }
    }
}
exports.FetchWithCookie = FetchWithCookie;
//# sourceMappingURL=fetch-helper.js.map