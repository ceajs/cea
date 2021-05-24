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
const tesseract_js_1 = require("tesseract.js");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const tessdataPath = '/tmp/eng.traineddata.gz';
function downloadTessdata() {
    return __awaiter(this, void 0, void 0, function* () {
        process.env.TESSDATA_PREFIX = '/tmp';
        if (!fs_1.default.existsSync('/tmp')) {
            fs_1.default.mkdirSync('/tmp');
        }
        else {
            if (fs_1.default.existsSync(tessdataPath)) {
                return;
            }
        }
        download('https://beetcb.gitee.io/filetransfer/tmp/eng.traineddata.gz', tessdataPath);
    });
}
function download(url, filename) {
    return __awaiter(this, void 0, void 0, function* () {
        const stream = fs_1.default.createWriteStream(filename);
        const res = yield node_fetch_1.default(url);
        const result = yield new Promise((resolve, reject) => {
            res.body.pipe(stream);
            res.body.on('error', reject);
            stream.on('close', () => resolve(`Downloaded tess data as ${filename}`));
        });
        return result;
    });
}
function ocr(captchaUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        yield downloadTessdata();
        const worker = tesseract_js_1.createWorker({
            langPath: '/tmp',
            cachePath: '/tmp',
        });
        yield worker.load();
        yield worker.loadLanguage('eng');
        yield worker.initialize('eng');
        yield worker.setParameters({
            tessedit_char_whitelist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
        });
        const { data: { text }, } = yield worker.recognize(captchaUrl);
        yield worker.terminate();
        return text;
    });
}
exports.default = ocr;
//# sourceMappingURL=capcha.js.map