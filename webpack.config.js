const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let sourceDir = path.resolve(__dirname, 'src');
let buildDir = path.resolve(__dirname, 'dist');

const config = {
  entry: [
    './src/index.js',
    './src/style.css'
],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(sourceDir, 'style.css'),
          to: path.resolve(buildDir, 'style.css')
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ]
};

module.exports = config;