const WebpackOnBuildPlugin = require('on-build-webpack')
const create = require('../service-worker/index.js')

module.exports = (outputPath) => {
    new WebpackOnBuildPlugin(function (stats) {
        // After webpack build...
        create(outputPath)
    })
}