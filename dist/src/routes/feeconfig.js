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
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const client = (0, redis_1.createClient)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
}))();
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const feeConfigs = [];
        let feeSpec = req.body;
        const parsedData = [];
        if (!feeSpec) {
            res.status(400).json('No Fee Spec Passed');
        }
        feeSpec = feeSpec.FeeConfigurationSpec.split("\n");
        feeSpec.forEach(element => {
            parsedData.push(element.trim().split(/ |\(|\) | : |APPLY | /));
        });
        parsedData.forEach(x => {
            const fee = {};
            fee.FEE_ID = x[0];
            fee.FEE_CURRENCY = x[1];
            fee.FEE_LOCALE = x[2];
            fee.FEE_ENTITY = x[3];
            fee.ENTITY_PROP = x[4];
            fee.FEE_TYPE = x[7];
            fee.FEE_VALUE = x[8];
            feeConfigs.push(fee);
        });
        yield client.set('FeeConfig', JSON.stringify(feeConfigs));
        const data = yield client.get('FeeConfig');
        // tslint:disable-next-line:no-console
        // console.log("Saved to DB", JSON.parse(data))
        res.status(200).json({ status: 'ok', data: feeConfigs });
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`Parse Fee({ content: ${req.body.content} }) >> Error: ${error.stack}`);
        res.status(500).json(error);
    }
}));
exports.default = router;
//# sourceMappingURL=feeconfig.js.map