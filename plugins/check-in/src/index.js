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
exports.checkIn = exports.CheckIn = void 0;
const cea_core_1 = require("cea-core");
const types_1 = require("./types");
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto_1 = __importDefault(require("crypto"));
const uuid_1 = require("uuid");
class CheckIn {
    constructor(user) {
        const school = cea_core_1.sstore.get('schools')[user.school];
        this.school = school;
        this.user = user;
        this.headers = {
            'user-agent': 'Mozilla/5.0 (Linux; Android 10; GM1910 Build/QKQ1.190716.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/87.0.4280.101 Mobile Safari/537.36  cpdaily/8.2.13 wisedu/8.2.13',
            'content-type': 'application/json',
        };
    }
    signInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            yield cea_core_1.handleCookie();
            const { user, school } = this;
            const storeCookiePath = `cookie.${user.alias}`;
            const cookie = cea_core_1.sstore.get(storeCookiePath);
            if (!cookie) {
                cea_core_1.log.error({
                    message: 'COOKIE 无效',
                    suffix: `@${user.alias}`,
                });
                return;
            }
            this.headers.cookie = cookie['campusphere::/'];
            const res = yield node_fetch_1.default(`${school.campusphere}${cea_core_1.CampusphereEndpoint.getStuSignInfosInOneDay}`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({}),
            });
            const signQ = yield res.json();
            const isValidCookie = signQ.message === 'SUCCESS';
            if (isValidCookie) {
                const data = signQ.datas;
                return data.unSignedTasks[0] || data.leaveTasks[0];
            }
        });
    }
    signWithForm(curTask) {
        return __awaiter(this, void 0, void 0, function* () {
            const { school, headers, user } = this;
            const { signInstanceWid, signWid } = curTask;
            let res = yield node_fetch_1.default(`${school.campusphere}${cea_core_1.CampusphereEndpoint.detailSignInstance}`, {
                headers,
                method: 'POST',
                body: JSON.stringify({ signInstanceWid, signWid }),
            });
            const signDetails = (yield res.json()).data;
            let { extraField, longitude, latitude, signPlaceSelected, isNeedExtra, signedStuInfo, } = signDetails;
            let position;
            const placeList = signPlaceSelected[0];
            const isSignAtHome = Boolean(school.defaultAddr);
            [longitude, latitude, position] = isSignAtHome
                ? this.user.addr
                : [placeList.longitude, placeList.latitude, school.defaultAddr];
            const extraFieldItems = this.fillExtra(extraField);
            const form = {
                signInstanceWid,
                longitude,
                latitude,
                isNeedExtra,
                extraFieldItems,
                isMalposition: isSignAtHome ? 1 : 0,
                abnormalReason: '',
                signPhotoUrl: '',
                position,
                uaIsCpadaily: true,
                signVersion: '1.0.0',
            };
            headers['Cpdaily-Extension'] = this.extention(form);
            res = yield node_fetch_1.default(`${school.campusphere}${cea_core_1.CampusphereEndpoint.submitSign}`, {
                headers,
                method: 'POST',
                body: JSON.stringify(form),
            });
            const result = yield res.json();
            const logInfo = {
                [types_1.LogInfoKeys.result]: result.message,
                [types_1.LogInfoKeys.addr]: form.position,
                [types_1.LogInfoKeys.name]: signedStuInfo.userName,
            };
            if (process.env.GITHUB_ACTION) {
                delete logInfo[types_1.LogInfoKeys.addr];
                delete logInfo[types_1.LogInfoKeys.name];
            }
            return logInfo;
        });
    }
    fillExtra(extraField) {
        return extraField.map((e) => {
            let chosenWid;
            const normal = e.extraFieldItems.filter((i) => {
                if (i.isAbnormal === false)
                    chosenWid = i.wid;
                return !i.isAbnormal;
            })[0];
            return {
                extraFieldItemWid: chosenWid,
                extraFieldItemValue: normal.content,
            };
        });
    }
    extention(form) {
        const Cpdaily_Extension = {
            lon: form.longitude,
            model: 'Cock',
            appVersion: '8.2.14',
            systemVersion: '4.4.4',
            userId: this.user.username,
            systemName: 'android',
            lat: form.latitude,
            deviceId: uuid_1.v1(),
        };
        return this.encrypt(Cpdaily_Extension);
    }
    encrypt(ce) {
        const algorithm = 'des-cbc';
        const key = 'b3L26XNL';
        const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(JSON.stringify(ce), 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return encrypted;
    }
    decrypt() {
        const algorithm = 'des-cbc';
        const key = 'b3L26XNL';
        const iv = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);
        const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        const encrypted = 'long base 64';
        let decrypted = decipher.update(encrypted, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
    }
}
exports.CheckIn = CheckIn;
function checkIn() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = cea_core_1.sstore.get('users');
        const logs = yield signIn(users);
        console.table(logs);
    });
}
exports.checkIn = checkIn;
function signIn(users) {
    return __awaiter(this, void 0, void 0, function* () {
        const logs = {};
        yield Promise.all(users.map((i) => __awaiter(this, void 0, void 0, function* () {
            const instance = new CheckIn(i);
            const curTask = yield instance.signInfo();
            if (curTask) {
                const result = yield instance.signWithForm(curTask);
                logs[i.alias] = result;
            }
        })));
        return logs;
    });
}
//# sourceMappingURL=index.js.map