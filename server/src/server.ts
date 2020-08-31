import express from 'express';
import MOHApi from './MOHAPI/mainRoute';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

const app = express();

app.use('/mohApi', MOHApi);
app.use('/clientToDBApi', ClientToDBApi)

postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
