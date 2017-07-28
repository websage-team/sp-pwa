const fs = require('fs')
const path = require('path')
const fsp = require('fs-promise')
const glob = require('glob-promise')
const md5File = require('md5-file')
const parseOptions = require('../parse-options')

function create(settings = {}, ...args) {
    let options = Object.assign({
        outputPath: process.cwd() + '/dist/public/',
        outputFilename: 'service-worker.js',
        customServiceWorkerPath: path.resolve(__dirname, '../service-worker/index.js'),
        globPattern: '/client/**/*',
        globOptions: {},
        appendUrls: []
    }, parseOptions(settings, ...args))

    let files = ['/']
    const outputFile = path.resolve(options.outputPath, options.outputFilename)

    const parsePattern = pattern => {
        let first = pattern.substr(0, 1)
        let isExclude = false
        if (first === '!') {
            isExclude = true
            pattern = pattern.substr(1)
            first = pattern.substr(0, 1)
        }
        return (isExclude ? '!' : '')
            + options.outputPath
            + (first !== '/' ? '/' : '')
            + pattern
    }
    const globPattern = (typeof options.globPattern === 'string') ? parsePattern(options.globPattern) : options.globPattern
    const globOptions = Object.assign({
        nosort: true
    }, options.globOptions || {})

    if (Array.isArray(globOptions.ignore))
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

                file = path.normalize(file).replace(options.outputPath, '').split(path.sep).join('/')
                // files.push('/client' + file)
                files.push(file)
            })
            files = files.concat(options.appendUrls)
            return files
        })
        .then(() =>
            // fsp.readFile('../service-worker', { encoding: 'utf8' })
            fsp.readFile(options.customServiceWorkerPath, { encoding: 'utf8' })
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
        .then(() => {
            const segs = options.outputFilename.split('.')
            const ext = segs[segs.length - 1]
            segs.pop()
            
            return fsp.rename(
                outputFile,
                path.resolve(
                    options.outputPath,
                    `${segs.join('.')}.${md5File.sync(outputFile)}.${ext}`
                )
            )
        })
        .then(() => {
            console.log('service-worker.js created')
        })
}

module.exports = create