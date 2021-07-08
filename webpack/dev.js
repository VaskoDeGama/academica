'use strict'

const path = require('path')

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, '../dist/static'),
    clientLogLevel: 'none',
    publicPath: '/',
    compress: false,
    disableHostCheck: true,
    host: 'localhost',
    port: 9011,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:3000/'
    }

  }
}
