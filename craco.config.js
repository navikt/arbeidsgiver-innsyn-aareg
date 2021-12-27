const CracoLessPlugin = require('craco-less');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => ({
            ...webpackConfig,
            ...{
                resolve: {
                    ...webpackConfig.resolve,
                    fallback: {
                        "assert": require.resolve("assert/"),
                        "buffer": require.resolve("buffer/"),
                        "crypto": require.resolve("crypto-browserify"),
                        "fs": require.resolve("browserify-fs"),
                        "path": require.resolve("path-browserify"),
                        "process": require.resolve("process/browser"),
                        "stream": require.resolve("stream-browserify"),
                        "util": require.resolve("util/"),
                        "zlib":  require.resolve("browserify-zlib"),
                    }
                }
            }
        }),
    },
    devServer: {
        proxy: {
            '/arbeidsforhold/api': {
                target: 'http://localhost:8080',
                pathRewrite: { '^/arbeidsforhold/api': '/ditt-nav-arbeidsgiver-api/api' }
            }
        },
        onBeforeSetupMiddleware: ({app}) => {
            app.get('/arbeidsforhold/redirect-til-login', (req, res) => {
                const loginUrl =
                    'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';
                res.redirect(loginUrl);
            });
        },
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
