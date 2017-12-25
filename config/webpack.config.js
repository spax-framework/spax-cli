const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const postcssConfig = require('./postcss.config')

const resolve = (dest, base = process.cwd()) => path.resolve(base, dest)
const pkg = require(resolve('package.json'))

module.exports = {
  target: 'web',
  resolve: {
    modules: [process.cwd(), 'node_modules'],
    extensions: ['.ts', '.js', '.json', '.vue', '.css']
  },
  node: {
    fs: 'empty',
    net: 'empty'
  },
  devtool: 'cheap-module-eval-source-map',
  entry: {
    app: [
      './node_modules/regenerator-runtime/runtime.js',
      './node_modules/spax-cli/assets/index.js']
  },
  output: {
    path: resolve('dist'),
    publicPath: '',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js'
  },
  performance: {
    hints: false
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          postcss: postcssConfig,
          autoprefixer: false,
          loaders: {
            js: 'babel-loader',
            ts: 'babel-loader!ts-loader'
          },
          // 必须为 true，否则 vue-loader@12.0.0 会导致 css 加载顺序混乱
          extractCSS: true
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader'
        }, {
          loader: 'ts-loader'
        }]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: 'postcss-loader',
        options: postcssConfig
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // 'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('node_modules/spax-cli/assets/index.ejs'),
      title: `${pkg.name} - ${pkg.description}`,
      hash: false,
      inject: true,
      minify: {
        collapseWhitespace: false,
        minifyJS: false
      }
    }),
    new CopyWebpackPlugin([{
      from: resolve('static')
    }]),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: '[name].[contenthash].css',
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: process.cwd()
      }
    })
  ]
}
