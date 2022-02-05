import {TrxResponse,TrxPayload} from '../models/compute'
import {FeeSpec} from '../models/feespec'
import log from 'loglevel'



export const computeFee = async (feeCongig:FeeSpec,payload:TrxPayload) => {
    const response:TrxResponse ={} as TrxResponse;
    let appliedFee;


    if(feeCongig.FEE_TYPE === "FLAT"){
        appliedFee = feeCongig.FEE_VALUE
    }else if(feeCongig.FEE_TYPE === "PERC"){
        appliedFee = Math.round((+feeCongig.FEE_VALUE / 100) * payload.Amount)
    }
    else if(feeCongig.FEE_TYPE === "FLAT_PERC"){
        let feevalue: string[];
        feevalue = feeCongig.FEE_VALUE.toString().split(":");
        appliedFee = Math.round(parseInt(feevalue[0],10) + ((parseFloat(feevalue[1]) /100) * payload.Amount))

    }

    if(payload.Customer.BearsFee === true){
        response.APPLIEDFEE_ID = feeCongig.FEE_ID;
        response.APPLIEDFEEVALUE =  +appliedFee
        response.SETTLEAMOUMT = payload.Amount;
        response.CHARGEAMOUNT = +payload.Amount + +appliedFee
    }else if(payload.Customer.BearsFee === false){
        response.APPLIEDFEE_ID = feeCongig.FEE_ID;
        response.APPLIEDFEEVALUE =  appliedFee
        response.CHARGEAMOUNT = +payload.Amount
        response.SETTLEAMOUMT = payload.Amount  - appliedFee;
    }

    return response

}

