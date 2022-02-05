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
const computetrx_1 = require("../utilities/computetrx");
// const client = createClient();
const client = (0, redis_1.createClient)({ url: process.env.REDIS_URL });
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield client.connect();
}))();
const router = express_1.default.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let payload = {};
        const applicableConfig = [];
        let appliedConfig;
        const feeConfig = JSON.parse(yield client.get("FeeConfig"));
        payload = req.body;
        if (payload.Currency !== "NGN") {
            res.status(404).json({
                Error: `No fee configuration for ${payload.Currency} transactions`,
            });
            return;
        }
        feeConfig.forEach((val) => {
            let locale;
            if (payload.PaymentEntity.Country === payload.CurrencyCountry) {
                locale = "LOCL";
            }
            else {
                locale = "INTL";
            }
            if ((locale === val.FEE_LOCALE || val.FEE_LOCALE === "*") &&
                (payload.PaymentEntity.Type === val.FEE_ENTITY ||
                    val.FEE_ENTITY === "*") &&
                (val.ENTITY_PROP.trim() === "*" ||
                    val.ENTITY_PROP.trim() === payload.PaymentEntity.Brand ||
                    val.ENTITY_PROP.trim() === payload.PaymentEntity.ID ||
                    val.ENTITY_PROP.trim() === payload.PaymentEntity.Issuer ||
                    val.ENTITY_PROP.trim() === payload.PaymentEntity.Number ||
                    val.ENTITY_PROP.trim() === payload.PaymentEntity.SixID)) {
                let specitivityCount = 0;
                if (val.FEE_LOCALE === "*")
                    specitivityCount++;
                if (val.FEE_ENTITY === "*")
                    specitivityCount++;
                if (val.ENTITY_PROP === "*")
                    specitivityCount++;
                val.SPECITIVITY = specitivityCount;
                applicableConfig.push(val);
            }
        });
        /*      client.disconnect();
         */ if (applicableConfig.length < 1) {
            res.status(404).json({
                Error: `No fee configuration for this transactions was found`,
            });
            return;
        }
        appliedConfig = applicableConfig.reduce((prev, curr) => {
            return prev.SPECITIVITY < curr.SPECITIVITY ? prev : curr;
        });
        const response = yield (0, computetrx_1.computeFee)(appliedConfig, payload);
        res.status(200).json(response);
    }
    catch (error) {
        // tslint:disable-next-line:no-console
        console.error(`Parse Fee({ content: ${req.body} }) >> Error: ${error.stack}`);
        res.status(500).json(error);
    }
}));
exports.default = router;
//# sourceMappingURL=compute.js.map