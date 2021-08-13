const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  devtool: 'inline-source-map',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    main: './server/src/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist/server'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js'],
    modules: [
      `${__dirname}/node_modules`,
      'node_modules'
    ]
  }
}
