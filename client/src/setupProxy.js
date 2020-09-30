const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        '/db',
        createProxyMiddleware({
            target: process.env.REACT_APP_DB_API,
            pathRewrite: {
                '^/db': ''
            },
            changeOrigin: true
        })
    )
}