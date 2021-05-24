"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.handleCookie = exports.log = exports.sstore = void 0;
const logger_1 = __importDefault(require("./utils/logger"));
exports.log = logger_1.default;
const login_1 = __importDefault(require("./crawler/login"));
exports.sstore = require('@beetcb/sstore');
__exportStar(require("./types/conf"), exports);
__exportStar(require("./types/cookie"), exports);
__exportStar(require("./types/helper"), exports);
__exportStar(require("./conf"), exports);
function handleCookie() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(exports.sstore.get('users').map((i) => __awaiter(this, void 0, void 0, function* () {
            const storeCookiePath = `cookie.${i.alias}`;
            yield handleLogin(i, storeCookiePath);
        })));
    });
}
exports.handleCookie = handleCookie;
function handleLogin(i, storeCookiePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let cookie = exports.sstore.get(storeCookiePath);
        const name = i.alias;
        if (!cookie) {
            cookie = yield login_1.default(exports.sstore.get('schools')[i.school], i);
            if (cookie) {
                exports.sstore.set(storeCookiePath, cookie);
                logger_1.default.success({
                    message: `已成功获取并缓存 COOKIE`,
                    suffix: `@${name}`,
                });
            }
        }
        else {
            logger_1.default.success({
                message: `尝试使用缓存中的 COOKIE`,
                suffix: `@${name}`,
            });
        }
    });
}
//# sourceMappingURL=index.js.map