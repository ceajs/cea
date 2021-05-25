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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cea = exports.checkIn = void 0;
const cea_core_1 = require("cea-core");
var cea_check_in_1 = require("cea-check-in");
Object.defineProperty(exports, "checkIn", { enumerable: true, get: function () { return cea_check_in_1.checkIn; } });
class Cea {
    constructor() {
        this.plugins = new Set();
    }
    addPlugin(plugin) {
        this.plugins.add(plugin);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const plugin of this.plugins) {
                yield plugin();
            }
            cea_core_1.sstore.close();
        });
    }
}
exports.Cea = Cea;
//# sourceMappingURL=index.js.map