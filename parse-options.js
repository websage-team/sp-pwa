// outputPath, serviceWorkerJsFilePath, globPattern, globOptions, appendUrls
module.exports = (...args) => {
    if (typeof args[0] !== 'object' || args.length > 1) {
        let options = {
            outputPath: args[0],
            serviceWorkerPath: args[1],
            globPattern: args[2],
            globOptions: args[3],
            appendUrls: args[4]
        }
        for (let i in options) {
            if (options[i] === undefined || options[i] === null)
                delete options[i]
        }
        return options
    }

    return args[0]
}