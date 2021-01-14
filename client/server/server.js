const path = require('path');
const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');

require('dotenv').config();

const app = express();

app.use(session({
    secret: 'coronai'
}));

app.use((req, res, next) => {
    if(req.headers["x-ms-client-principal-name"]!== undefined) {
        req.headers.authorization = req.headers["x-ms-client-principal-name"];
    } else {
        req.headers.authorization = "fake token!";
    }
    next();
})

app.use('/db', (req, res, next) => {
    const { ip, protocol, path, hostname, body, cookies, params, query, headers, sessionID } = req;
    console.log('got request: ' + JSON.stringify({ ip, protocol, path, hostname, body, cookies, params, query, headers, sessionID }));
    console.log('*********************************************************************')
    next();
});

app.use(
    '/db',
    createProxyMiddleware({
        target: process.env.DB_API,
        pathRewrite: {
            '^/db': ''
        },
        changeOrigin: true,
        onProxyReq: (proxyReq, req, res) => {
            const { host, protocol, method, path } = proxyReq
            const { headers, sessionID } = req
            console.log('got proxy request: ' + JSON.stringify({ host, protocol, method, path, headers, sessionID }))
            console.log('*********************************************************************')
        },
        onProxyRes: (proxyRes, req, res) => {
            const { statusCode, statusMessage } = res;
            const { headers: requestHeaders, sessionID } = req;
            const { httpVersion, headers, method, url, statusCode: proxyStatusCode, statusMessage: proxyStatusMessage, body } = proxyRes
            console.log('got proxy response: ' + JSON.stringify({ httpVersion, headers, method, url, proxyStatusCode, proxyStatusMessage, body, requestHeaders, sessionID }))
            console.log('*********************************************************************')
            console.log('got response: ' + JSON.stringify({ statusCode, statusMessage, requestHeaders, sessionID }));
            console.log('*********************************************************************')
            console.log('*********************************************************************')
        },
        onError: (err, req, res) => {
            const { ip, protocol, path, hostname, body, cookies, params, query, headers, sessionID } = req;
            console.log('Error: ' + JSON.stringify({...err}) + '\nRequset: ' + JSON.stringify({ ip, protocol, path, hostname, body, cookies, params, query, headers, sessionID }));
        },
    })
)

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.listen(9090, () => console.log('client access server started on port 8080'));