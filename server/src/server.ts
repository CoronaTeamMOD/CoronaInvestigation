import express from 'express';
import postgraphileServices from './DBService/postgraphile';

require('dotenv').config();

const app = express();

postgraphileServices.forEach(postgraphileService => {
    app.use(postgraphileService);
});

app.listen(process.env.PORT, () => {
    console.log(`Server started at port ${process.env.PORT}`);
});
