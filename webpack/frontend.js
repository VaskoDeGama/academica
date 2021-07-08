'use strict'

const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = {
  entry: './client/index.js',
  output: {
    publicPath: '/',
    filename: 'bundle.[contenthash].js',
    path: path.resolve('dist'),
    clean: true
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false,
              esModule: false
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      templateContent: `<!doctype html>
                <html lang="en">
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                    <link rel="shortcut icon" href="./static/favicon.ico">
                    <title>Mining ops tool</title>
                  </head>
                  <body>
                    <div id="app"></div>
                  </body>
                </html>`
    }),
    new CopyPlugin({
      patterns: [
        { from: 'client/assets/static', to: 'static' }
      ]
    }),
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? '.env' : '.env.defaults'
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  devtool: false,
  performance: {
    hints: false
  }
}
