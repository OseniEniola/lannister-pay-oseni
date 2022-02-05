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
const compute_1 = __importDefault(require("./routes/compute"));
const feeconfig_1 = __importDefault(require("./routes/feeconfig"));
const body_parser_1 = __importDefault(require("body-parser"));
const redis_1 = require("redis");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("../swagger.json"));
const cors_1 = __importDefault(require("cors"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = (0, redis_1.createClient)();
    client.on('error', (err) => // tslint:disable-next-line:no-console
     console.log('Redis Client Error', err));
    client.on('connect', () => // tslint:disable-next-line:no-console
     console.log('Redis Connected'));
    yield client.connect();
    yield client.set('key', 'value');
    const value = yield client.get('key');
}))();
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.get('/', (req, res) => res.sendStatus(200));
app.get('/health', (req, res) => res.sendStatus(200));
app.use("/fees", feeconfig_1.default);
app.use("/compute-transaction-fee", compute_1.default);
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map