#!/usr/bin/env node --harmony

process.env.NODE_ENV = 'development'

const commander = require('commander')
const chalk = require('chalk')
const webpack = require('webpack')
const webpackDevServer = require('webpack-dev-server')

const webpackConfig = require('../config/webpack.config')
const webpackDevServerConfig = require('../config/webpack-dev-server.config')

const { HOST = '0.0.0.0', PORT = 3000 } = process.env

commander.on('--help', function () {})
commander.usage('[options]').parse(process.argv)

const compiler = webpack(webpackConfig)
const devServer = new webpackDevServer(compiler, webpackDevServerConfig)

devServer.listen(PORT, HOST, err => {
  if (err) {
    console.error(err)
  }

  console.info(chalk.green('Starting server with HMR'))
  console.info(chalk.green('Server now is running at http://' + HOST + ':' + PORT))

  ;['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, function () {
    devServer.close()
    process.exit()
  }))
})
