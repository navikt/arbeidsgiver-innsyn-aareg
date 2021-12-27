const CracoLessPlugin = require('craco-less');
const {ProvidePlugin} = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => ({
            ...webpackConfig,
            ...{
                plugins: [
                    ...webpackConfig.plugins,
                    new ProvidePlugin({
                        Buffer: [require.resolve("buffer/"), "Buffer"],
                        process: require.resolve("process/browser")
                    })
                ],
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
                        "zlib": require.resolve("browserify-zlib"),
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
        setupMiddlewares: (middlewares, {app}) => {
            app.get('/arbeidsforhold/redirect-til-login', (req, res) => {
                const loginUrl =
                    'http://localhost:8080/ditt-nav-arbeidsgiver-api/local/selvbetjening-login?redirect=http://localhost:3000/arbeidsforhold';
                res.redirect(loginUrl);
            });
            return middlewares;
        },
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
