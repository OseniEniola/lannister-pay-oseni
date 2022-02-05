import express from "express";
import compute from "./routes/compute";
import feeconfig from "./routes/feeconfig";
import bodyParser from "body-parser";
import {createClient} from 'redis';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import  swaggerDocument from '../swagger.json';
import cors from 'cors'

(async () => {
//  const client = createClient();
  const client = createClient({url: process.env.REDIS_URL});
  client.on('error', (err) =>   // tslint:disable-next-line:no-console
  console.log('Redis Client Error', err));
  client.on('connect',()=>   // tslint:disable-next-line:no-console
  console.log('Redis Connected'))
  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');
})();

const app = express();
const port = 3000;

app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument)
);
app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));


app.use("/fees", feeconfig);
app.use("/compute-transaction-fee", compute);
app.listen(process.env.PORT || 3000, () => {
  // tslint:disable-next-line:no-console
  console.log(`Express is listening at http://localhost:${port}`);
});
