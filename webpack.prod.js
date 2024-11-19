const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'build'), // Especifica la carpeta de salida
        filename: '[name].[contenthash].js',
        publicPath: '/',
    },
    plugins: [
        new Dotenv({
            path: './.env',
            systemvars: true,
        }),
    ],
});
