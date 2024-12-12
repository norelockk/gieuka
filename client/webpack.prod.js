const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        minimize: true, // Enable minimization
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    module: false,
                    mangle: {
                        properties:  {
                            reserved: require('../shared/props.json'),
                            keep_quoted: true,
                        },
                    },
                    compress: {
                        join_vars: false,
                        hoist_vars: false,
                        reduce_vars: false,
                        collapse_vars: false,
                        drop_console: false,
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: true,
            }),
        ],
    },
});
