import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import logger from './Logger/Logger';
import LogAPI from './LogAPI';
import MOHApi from './MOHAPI/mainRoute';
import initScriptRunner from './ScriptRunner';
import { Service, Severity } from './Models/Logger/types';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import convertToJson from './middlewares/ConvertToObject';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

initScriptRunner();

const app = express();

app.use(
    cors({
        origin: JSON.parse(`${process.env.CORS_ALLOWED_ORIGINS}`),
    })
);

app.use(bodyParser.text());
app.use(convertToJson)
app.use('/mohApi', MOHApi);
app.use('/clientToDBApi', ClientToDBApi);
app.use('/log', LogAPI);

postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    logger.info({
        service: Service.SERVER,
        severity: Severity.LOW,
        step: `server started on port ${process.env.PORT}`,
        workflow: 'initiate server'
    });
});
