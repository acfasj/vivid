const merge = require('webpack-merge')
const common = require('./webpack.common')
const WebpackChromeReloaderPlugin = require('webpack-chrome-extension-reloader')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new WebpackChromeReloaderPlugin({
      entries: {
        background: 'background',
        contentScript: 'content'
      }
    })
  ]
});
