const fs = require('fs')
const path = require('path')
const fsp = require('fs-promise')
const glob = require('glob-promise')
const md5File = require('md5-file')

function create(outputPath) {
    let files = ['/']
    const pathSW = path.resolve(__dirname, '../service-worker/index.js')
    const outputFile = path.resolve(outputPath, '../service-worker.js')

    glob(outputPath + '/**/*')
        .then(res => {
            res.forEach(function (file) {
                // ignore directories
                if (fs.lstatSync(file).isDirectory()) return
                // ignore .map files
                if (path.extname(file) === '.map') return
                file = path.normalize(file).replace(outputPath, '').split(path.sep).join('/')
                files.push('/client' + file)
            })
            return files
        })
        .then(() =>
            // fsp.readFile('../service-worker', { encoding: 'utf8' })
            fsp.readFile(pathSW, { encoding: 'utf8' })
        )
        .then(content =>
            fsp.writeFile(
                outputFile,
                content.replace(
                    /const urlsToCache = \[\]/g,
                    'const urlsToCache = ' + JSON.stringify(files)
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