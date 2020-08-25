import express from 'express';

const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
   console.log('got request');
});

app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
