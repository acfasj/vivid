const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[contentHash].js',
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin()
  ]
})
