import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import logger from './Logger/Logger';
import MOHApi from './MOHAPI/mainRoute';
import { Service, Severity } from './Models/Logger/types';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import convertToJson from './middlewares/ConvertToObject';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

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
