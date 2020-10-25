const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use((req, res, next) => {
        req.headers.authorization = "fake token!";
        next();
    });

    app.use(
        '/db',
        createProxyMiddleware({
            target: process.env.REACT_APP_DB_API,
            pathRewrite: {
                '^/db': ''
            },
            changeOrigin: true
        })
    );
}