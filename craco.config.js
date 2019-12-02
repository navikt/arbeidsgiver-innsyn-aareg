const CracoLessPlugin = require("craco-less");

module.exports = {
    devServer: {
        proxy: {
            '/bedriftsoversikt-og-ansatte/api': {
                target: 'http://localhost:8080',
                pathRewrite: {'^/bedriftsoversikt-og-ansatte/api' : '/ditt-nav-arbeidsgiver-api/api'}
            }
        },
        before: (app) => {
            app.get('/bedriftsoversikt-og-ansatte/redirect-til-login', (req, res) => {
                const loginUrl = 'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/bedriftsoversikt-og-ansatte';
                res.redirect(loginUrl);
            });
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
