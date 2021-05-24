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
exports.getSchoolInfos = exports.loadConfFromToml = void 0;
const toml_1 = require("@iarna/toml");
const path_1 = require("path");
const node_fetch_1 = __importDefault(require("node-fetch"));
const logger_1 = __importDefault(require("./utils/logger"));
const fs_1 = __importDefault(require("fs"));
function loadConfFromToml() {
    const path = path_1.resolve('./conf.toml');
    if (fs_1.default.existsSync(path)) {
        const usersConf = toml_1.parse(fs_1.default.readFileSync(path, 'utf8')).users;
        return usersConf;
    }
    return null;
}
exports.loadConfFromToml = loadConfFromToml;
function getSchoolInfos(users) {
    return __awaiter(this, void 0, void 0, function* () {
        let res, defaultAddr = '', schoolInfos = {};
        const schoolNamesSet = new Set(users.map((e) => e.school));
        const isSchoolAddrNeeded = users.find((e) => e.addr.length === 1);
        for (const abbreviation of schoolNamesSet) {
            res = (yield node_fetch_1.default(`https://mobile.campushoy.com/v6/config/guest/tenant/info?ids=${abbreviation}`).catch((err) => logger_1.default.error(err)));
            const data = JSON.parse((yield res.text().catch((err) => logger_1.default.error(err)))).data[0];
            let origin = new URL(data.ampUrl).origin;
            const casOrigin = data.idsUrl;
            if (!origin.includes('campusphere')) {
                origin = new URL(data.ampUrl2).origin;
            }
            if (isSchoolAddrNeeded) {
                res = (yield node_fetch_1.default(`https://api.map.baidu.com/?qt=s&wd=${encodeURIComponent(data.name)}&ak=E4805d16520de693a3fe707cdc962045&rn=10&ie=utf-8&oue=1&fromproduct=jsapi&res=api`).catch((err) => logger_1.default.error(err)));
                const addrInfo = yield res.json();
                defaultAddr = addrInfo.content[0].addr;
            }
            schoolInfos[abbreviation] = {
                defaultAddr,
                loginStartEndpoint: `${origin}/iap/login?service=${encodeURIComponent(`${origin}/portal/login`)}`,
                swms: casOrigin,
                chineseName: data.name,
                campusphere: origin,
                isIap: data.joinType !== 'NOTCLOUD',
            };
            logger_1.default.success({ message: `学校 ${data.name} 默认签到地址：${defaultAddr}` });
            logger_1.default.success({ message: `学校 ${data.name} 已完成设定` });
        }
        return schoolInfos;
    });
}
exports.getSchoolInfos = getSchoolInfos;
//# sourceMappingURL=conf.js.map