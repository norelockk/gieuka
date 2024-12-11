const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const common = require('./webpack.common.js');

const reactDomProps = require('react-dom-props')

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
                        drop_console: true,
                        unsafe_methods: true,
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
