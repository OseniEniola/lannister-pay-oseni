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
exports.computeFee = void 0;
const computeFee = (feeCongig, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const response = {};
    let appliedFee;
    if (feeCongig.FEE_TYPE === "FLAT") {
        appliedFee = feeCongig.FEE_VALUE;
    }
    else if (feeCongig.FEE_TYPE === "PERC") {
        appliedFee = Math.round((+feeCongig.FEE_VALUE / 100) * payload.Amount);
    }
    else if (feeCongig.FEE_TYPE === "FLAT_PERC") {
        let feevalue;
        feevalue = feeCongig.FEE_VALUE.toString().split(":");
        appliedFee = Math.round(parseInt(feevalue[0], 10) + ((parseFloat(feevalue[1]) / 100) * payload.Amount));
    }
    if (payload.Customer.BearsFee === true) {
        response.APPLIEDFEE_ID = feeCongig.FEE_ID;
        response.APPLIEDFEEVALUE = +appliedFee;
        response.SETTLEAMOUMT = payload.Amount;
        response.CHARGEAMOUNT = +payload.Amount + +appliedFee;
    }
    else if (payload.Customer.BearsFee === false) {
        response.APPLIEDFEE_ID = feeCongig.FEE_ID;
        response.APPLIEDFEEVALUE = appliedFee;
        response.CHARGEAMOUNT = +payload.Amount;
        response.SETTLEAMOUMT = payload.Amount - appliedFee;
    }
    return response;
});
exports.computeFee = computeFee;
//# sourceMappingURL=computetrx.js.map