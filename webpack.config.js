var webpack = require("webpack");
var path = require("path");

var DIST_DIR = path.resolve(__dirname, "dist");
var SRC_DIR = path.resolve(__dirname, "src");

var config = {
    entry: SRC_DIR + "/app/index.js",
    output: {
        path: DIST_DIR + "/app",
        filename: "bundle.js",
        publicPath: "/app/"
    },
    module: {
        rules: [
            {
              test: /\.js?/,
              include: SRC_DIR,
              use: 'babel-loader',
              exclude: /node_modules/
            },
            {
              test: /\.rt$/,
              use: 'react-templates-loader',
              include: SRC_DIR
            },
            {
              test: /\.css?/,
              include: [SRC_DIR, path.resolve('./node_modules')],
              use: ['style-loader', 'css-loader']
            },
            {
              test: /\.scss$/,
              use: ['style-loader', 'css-loader', 'sass-loader']
            }
          ]
    },
    // plugins: []
    mode: "development",
    performance: { hints: false }
}

module.exports = config;