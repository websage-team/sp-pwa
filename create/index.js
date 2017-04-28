const fs = require('fs')
const path = require('path')
const fsp = require('fs-promise')
const glob = require('glob-promise')
const md5File = require('md5-file')

function create(
    outputPath,
    serviceWorkerJsFilePath = path.resolve(__dirname, '../service-worker/index.js'),
    globPattern = '/**/*',
    globOptions = {}
) {
    let files = ['/']
    const outputFile = path.resolve(outputPath, '../service-worker.js')
    const parsePattern = pattern => {
        let first = pattern.substr(0, 1)
        let isExclude = false
        if (first === '!') {
            isExclude = true
            pattern = pattern.substr(1)
            first = pattern.substr(0, 1)
        }
        return (isExclude ? '!' : '')
            + outputPath
            + (first !== '/' ? '/' : '')
            + pattern
    }

    if (typeof globPattern === 'string')
        globPattern = parsePattern(globPattern)
    
    globOptions = Object.assign({
        nosort: true
    }, globOptions)

    if(Array.isArray(globOptions.ignore))
        globOptions.ignore.forEach((pattern, index) => {
            globOptions.ignore[index] = parsePattern(pattern)
        })

    glob(globPattern, globOptions)
        .then(res => {
            res.forEach(function (file) {
                // ignore directories
                if (fs.lstatSync(file).isDirectory()) return
                // ignore .map files
                if (path.extname(file) === '.map') return
                // ignore some files
                if (path.basename(file, '.js').indexOf('critical-extra-old-ie') > -1) return

                file = path.normalize(file).replace(outputPath, '').split(path.sep).join('/')
                files.push('/client' + file)
            })
            return files
        })
        .then(() =>
            // fsp.readFile('../service-worker', { encoding: 'utf8' })
            fsp.readFile(serviceWorkerJsFilePath, { encoding: 'utf8' })
        )
        .then(content =>
            fsp.writeFile(
                outputFile,
                content.replace(
                    /urlsToCache\s*=\s*\[\]/g,
                    'urlsToCache = ' + JSON.stringify(files)
                ),
                'utf8'
            )
        )
        .then(() =>
            fsp.rename(outputFile, path.resolve(outputPath, `../service-worker.${md5File.sync(outputFile)}.js`))
        )
        .then(() => {
            console.log('service-worker.js created')
        })
}

module.exports = create