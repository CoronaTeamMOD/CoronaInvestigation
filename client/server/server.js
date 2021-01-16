const path = require('path');
const express = require('express');
const session = require('express-session');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { Severity, logger } = require('./logger');

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
    logger.info({
        workflow: 'Proxying a request', 
        step: 'Getting Request', 
        severity: Severity.LOW, 
        details: { ip, protocol, path, hostname, body, cookies, params, query, headers },
        sessionID
    })
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
            logger.info({
                workflow: 'Proxying a request', 
                step: 'Proxy Redirecting (Request)', 
                severity: Severity.LOW, 
                details: { host, protocol, method, path, headers },
                sessionID
            })
        },
        onProxyRes: (proxyRes, req, res) => {
            const { statusCode, statusMessage } = res;
            const { headers: requestHeaders, sessionID } = req;
            const { httpVersion, headers, method, url, statusCode: proxyStatusCode, statusMessage: proxyStatusMessage, body } = proxyRes
            logger.info({
                workflow: 'Proxying a request', 
                step: 'Proxy Redirecting (Response)', 
                severity: Severity.LOW, 
                details: { httpVersion, headers, method, url, proxyStatusCode, proxyStatusMessage, body, requestHeaders },
                sessionID
            })
            logger.info({
                workflow: 'Proxying a request', 
                step: 'Got Response', 
                severity: Severity.LOW, 
                details: { statusCode, statusMessage, requestHeaders },
                sessionID
            })
        },
        onError: (err, req, res) => {
            const { ip, protocol, path, hostname, body, cookies, params, query, headers, sessionID } = req;
            logger.error({
                workflow: 'Proxying a request', 
                step: `Got Error: ${JSON.stringify({...err})}`, 
                severity: Severity.HIGH, 
                details: { ip, protocol, path, hostname, body, cookies, params, query, headers },
                sessionID
            })
        },
    })
)

app.use(express.static(path.join(__dirname, '..', 'build')));

app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.listen(8080, () => console.log('client access server started on port 8080'));