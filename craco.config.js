const CracoLessPlugin = require('craco-less');

module.exports = {
    devServer: {
        proxy: {
            '/arbeidsforhold/api': {
                target: 'http://localhost:8080',
                pathRewrite: { '^/arbeidsforhold/api': '/ditt-nav-arbeidsgiver-api/api' }
            }
        },
        before: app => {
            app.get('/arbeidsforhold/redirect-til-login', (req, res) => {
                const loginUrl =
                    'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';
                res.redirect(loginUrl);
            });
        }
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
