const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'http://localhost:3016',
        changeOrigin: true,
      })
    );

    app.use(
        '/socket.io',
        createProxyMiddleware({
            target: 'http://localhost:3016',
            changeOrigin: true
        })
    );
  };