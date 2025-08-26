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
    plugins: [{ plugin: CracoLessPlugin }]
};
