const path = require('path')
const HtmlWbpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js' // 用 webpack 1 时需用 'vue/dist/vue.common.js'
    }
  },
  entry: {
    background: './src/background.js',
    content: './src/content.js',
    option: './src/option.js',
    popup: './src/popup.js'
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(['dist']),
    new HtmlWbpackPlugin({
      filename: 'option.html',
      template: './src/option.html',
      chunks: [ 'option' ]
    }),
    new HtmlWbpackPlugin({
      filename: 'popup.html',
      template: './src/popup.html',
      chunks: [ 'popup' ]
    }),
    new CopyWebpackPlugin([
      { from: './src/manifest.json' }
    ]),
    new CopyWebpackPlugin([
      { from: './src/static', to: 'static' }
    ])
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    // runtimeChunk: 'single',
    // splitChunks: {
    //   chunks: 'all',
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name: 'vendors',
    //       chunks: 'all'
    //     }
    //   }
    // }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.styl(us)?$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [ 'file-loader' ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [ 'file-loader' ]
      }
    ]
  }
}