const webpack = require('webpack');

module.exports = {
    webpack: {
        configure: {
            resolve: {
                fallback: {
                    stream: require.resolve('stream-browserify'),
                    zlib: require.resolve('browserify-zlib'),
                    util: require.resolve('util/'),
                    buffer: require.resolve('buffer/'),
                    process: require.resolve('process/browser'),
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                }),
            ],
        },
    },
};