const WebpackOnBuildPlugin = require('on-build-webpack')
const create = require('../create/index.js')
const parseOptions = require('../parse-options')

const extend = (...args) => {
    return new WebpackOnBuildPlugin(function (stats) {
        // After webpack build...
        create(parseOptions(...args))
    })
}

module.exports = extend