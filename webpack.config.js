const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './client/index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(`${__dirname}/dist`)
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  devServer: {
    host: 'localhost',
    port: '1990',
    inline: true
  },
  plugins: [
    new HTMLWebpackPlugin()
  ]
}
