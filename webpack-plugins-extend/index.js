const WebpackOnBuildPlugin = require('on-build-webpack')
const create = require('../create/index.js')

module.exports = (outputPath, serviceWorkerJsFilePath) => {
    return new WebpackOnBuildPlugin(function (stats) {
        // After webpack build...
        create(outputPath, serviceWorkerJsFilePath)
    })
}