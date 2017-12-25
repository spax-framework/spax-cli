const path = require('path')
const resolve = dest => path.resolve(process.cwd(), dest)

module.exports = {
  plugins: [
    require('postcss-import')({
      path: resolve('application/styles')
    }),
    require('postcss-url')({
      basePath: resolve('static')
    }),
    require('postcss-cssnext')({
      features: {
        customProperties: {
          variables: require(resolve('application/styles/variables'))
        }
      }
    }),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}