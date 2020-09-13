import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';

import MOHApi from './MOHAPI/mainRoute';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

const app = express();
app.use(
    cors({
        origin: JSON.parse(`${process.env.CORS_ALLOWED_ORIGINS}`),
        credentials: true
    })
);

app.use(bodyParser.json());
app.use('/mohApi', MOHApi);
app.use('/clientToDBApi', ClientToDBApi);

postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
