const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: './src/main.ts'
    },
    output: {
        filename: 'game.js',
        publicPath: '',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            'types': path.resolve(__dirname, 'types'),
            'engine': path.resolve(__dirname, 'src', 'engine'),
            'shared': path.resolve(__dirname, '..', 'shared'),
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }, // Copies assets from 'assets' to 'build/assets'
            ],
        }),
        // babel for es5
        new webpack.LoaderOptionsPlugin({
            options: {
                babel: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            }
        })
    ],
    optimization: {
        moduleIds: 'named',       // Keep module names consistent between builds
        splitChunks: false,       // Disable code splitting
        runtimeChunk: false,      // Disable runtime chunk generation
    },
    watchOptions: {
        ignored: /node_modules/
    }
};
