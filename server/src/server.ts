import express from 'express';
import MOHApi from './MOHAPI/mainRoute';
import ClientToDBApi from './ClientToDBAPI/mainRoute';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

const app = express();

app.use('/mohapi', MOHApi);
app.use('/clientToDBapi', ClientToDBApi)

postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
