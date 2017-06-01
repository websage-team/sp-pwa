export default (args) => {
    const dirToCheck = path.resolve(args.distPathName, 'public')
    const fs = require('fs')

    if(!fs.existsSync(dirToCheck)) return ''

    const path = require('path')
    const files = fs.readdirSync(dirToCheck)

    let fileJS
    files.forEach(f => {
        var regexp = new RegExp(`^service-worker\.([^.]+).js$`)
        if (regexp.test(f)) fileJS = f
    })

    return `/${fileJS}`
}