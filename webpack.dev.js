const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
    after() {

    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new WriteFilePlugin()
  ]
});
