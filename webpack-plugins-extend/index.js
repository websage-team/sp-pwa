const WebpackOnBuildPlugin = require('on-build-webpack')
const create = require('../create/index.js')

module.exports = (outputPath, serviceWorkerJsFilePath, globPattern, globOptions, appendUrls) => {
    return new WebpackOnBuildPlugin(function (stats) {
        // After webpack build...
        create(outputPath, serviceWorkerJsFilePath, globPattern, globOptions, appendUrls)
    })
}