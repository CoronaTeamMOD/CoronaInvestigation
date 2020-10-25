require('dotenv').config();
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')

require('dotenv').config();

const app = express();

app.use((req, res, next) => {
    if(req.headers["x-ms-token-aad-id-token"]) {
        req.headers.authorization = req.headers["x-ms-token-aad-id-token"];
    }
    next();
})

app.use(
    '/db',
    createProxyMiddleware({
        target: process.env.DB_API,
        pathRewrite: {
            '^/db': ''
        },
        changeOrigin: true
    })
)

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.listen(8080, () => console.log('client access server started on port 8080'));