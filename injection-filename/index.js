export default (args) => {
    const fs = require('fs')
    const path = require('path')
    const files = fs.readdirSync(path.resolve(args.distPathName, 'public'))

    let fileJS
    files.forEach(f => {
        var regexp = new RegExp(`^service-worker\.([^.]+).js$`)
        if (regexp.test(f)) fileJS = f
    })

    return `/${fileJS}`
}