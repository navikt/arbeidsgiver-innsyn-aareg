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

        setupMiddlewares: (middlewares, {app}) => {
            const cookieParser = require('cookie-parser');
            app.use(cookieParser());

            app.get('/arbeidsforhold/arbeidsgiver-arbeidsforhold/api/innlogget', (req, res) => {
                console.log("innlogget?")
                const token = req.cookies.hasOwnProperty('selvbetjening-idtoken')
                if (token) {
                    console.log("innlogget? ja (cookie selvbetjening-idtoken eksisterer)")
                    res.status(200).send()
                } else {
                    console.log("innlogget? nei (cookie selvbetjening-idtoken mangler)")
                    res.status(401).send()
                }
            });
            app.get('/arbeidsforhold/redirect-til-login', async (req, res) => {
                const response = await fetch('https://fakedings.dev-gcp.nais.io/fake/custom', {
                    method: 'POST',
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    body: `sub=00112233445&aud=${encodeURIComponent("bruker-api")}&acr=Level4`
                });
                const token = await response.text()
                res.cookie("selvbetjening-idtoken", token)
                console.log(`login: setter selvbetjening-idtoken til ${token}`)
                res.redirect("http://localhost:3000/arbeidsforhold/");
            });
            return middlewares;
        },
    },
    plugins: [{ plugin: CracoLessPlugin }]
};
