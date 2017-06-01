export default (args) => {
    const path = require('path')
    const fs = require('fs')

    const dirToCheck = path.resolve(args.distPathName, 'public')

    if(!fs.existsSync(dirToCheck)) return ''

    const files = fs.readdirSync(dirToCheck)

    let fileJS
    files.forEach(f => {
        var regexp = new RegExp(`^service-worker\.([^.]+).js$`)
        if (regexp.test(f)) fileJS = f
    })

    return `/${fileJS}`
}