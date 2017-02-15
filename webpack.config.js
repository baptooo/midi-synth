const path = require('path')
const webpack = require('webpack')
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
    new webpack.DefinePlugin({
      '__MIDI__': process.env.NODE_ENV === 'midi'
    }),
    new HTMLWebpackPlugin({
      title: 'Midi Synth',
      template: 'client/index.html'
    })
  ]
}
