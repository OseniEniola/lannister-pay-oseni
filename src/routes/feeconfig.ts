import express from 'express';
import  {FeeSpec} from '../models/feespec'
import {createClient} from 'redis';

//const client = createClient();
const client = createClient({url: process.env.REDIS_URL});


(async () => {
  await client.connect();
})();
const router = express.Router()


router.post('/',async (req, res) => {
    try {
        const feeConfigs: FeeSpec[]=[]
        let feeSpec = req.body
        const parsedData:string[] =[]
        if(!feeSpec){
            res.status(400).json('No Fee Spec Passed')
        }

        feeSpec = feeSpec.FeeConfigurationSpec.split("\n")
        feeSpec.forEach(element => {
         parsedData.push(element.trim().split(/ |\(|\) | : |APPLY | /))
              });
        parsedData.forEach(x =>{
            const fee:FeeSpec={} as FeeSpec
            fee.FEE_ID = x[0]
            fee.FEE_CURRENCY = x[1]
            fee.FEE_LOCALE = x[2]
            fee.FEE_ENTITY = x[3]
            fee.ENTITY_PROP= x[4]
            fee.FEE_TYPE = x[7]
            fee.FEE_VALUE= x[8]
            feeConfigs.push(fee)
        })
        await client.set('FeeConfig',JSON.stringify(feeConfigs))
        .then( ()=>{ client.disconnect()})
    // const data =  await client.get('FeeConfig')

        // tslint:disable-next-line:no-console
       // console.log("Saved to DB", JSON.parse(data))
        res.status(200).json({status:'ok', data: feeConfigs})
    } catch (error) {
        // tslint:disable-next-line:no-console
        console.error(
            `Parse Fee({ content: ${req.body.content} }) >> Error: ${error.stack}`
          );
          res.status(500).json(error);
    }
})

export default router