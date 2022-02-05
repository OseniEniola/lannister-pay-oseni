import express from "express";
import { TrxPayload, TrxResponse } from "../models/compute";
import { FeeSpec } from "../models/feespec";
import { createClient } from "redis";
import log from "loglevel";
import {computeFee} from '../utilities/computetrx'
const client = createClient();

(async () => {
  await client.connect();
})();
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    let payload: TrxPayload = {} as TrxPayload;
    const applicableConfig: FeeSpec[] = [];
    let appliedConfig;
    const feeConfig: FeeSpec[] = JSON.parse(await client.get("FeeConfig"));
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
      } else {
        locale = "INTL";
      }
      if (
        (locale === val.FEE_LOCALE || val.FEE_LOCALE === "*") &&
        (payload.PaymentEntity.Type === val.FEE_ENTITY ||
          val.FEE_ENTITY === "*") &&
        (val.ENTITY_PROP.trim() === "*" ||
          val.ENTITY_PROP.trim() === payload.PaymentEntity.Brand ||
          val.ENTITY_PROP.trim() === payload.PaymentEntity.ID ||
          val.ENTITY_PROP.trim() === payload.PaymentEntity.Issuer ||
          val.ENTITY_PROP.trim() === payload.PaymentEntity.Number ||
          val.ENTITY_PROP.trim() === payload.PaymentEntity.SixID)
      ) {
        let specitivityCount = 0;
        if (val.FEE_LOCALE === "*") specitivityCount++;
        if (val.FEE_ENTITY === "*") specitivityCount++;
        if (val.ENTITY_PROP === "*") specitivityCount++;
        val.SPECITIVITY = specitivityCount;
        applicableConfig.push(val);
      }
    });

    if (applicableConfig.length < 1) {
      res.status(404).json({
        Error: `No fee configuration for this transactions was found`,
      });
      return;
    }
    appliedConfig = applicableConfig.reduce((prev, curr) => {
      return prev.SPECITIVITY < curr.SPECITIVITY ? prev : curr;
    });

    const response = await computeFee(appliedConfig,payload)

    res.status(200).json(response);
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error(
      `Parse Fee({ content: ${req.body} }) >> Error: ${error.stack}`
    );
    res.status(500).json(error);
  }
});
export default router;
