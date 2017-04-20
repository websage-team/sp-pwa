export default (args) => {
    const fs = require('fs')
    const path = require('path')
    const files = fs.readdirSync(path.resolve(args.distPathName, 'public'))

    let fileJS
    files.forEach(f => {
        var regexp = new RegExp(`^service-worker\.([^.]+).js$`)
        if (regexp.test(f)) fileJS = f
    })

    return `<script>
        if ('serviceWorker' in navigator) {
            // console.log('Service Worker SUPPORTED')
            navigator.serviceWorker.register(
                '/${fileJS}', {
                    scope: '/'
                }
            ).then((reg) => {
                // console.log('Service Worker register', reg)
            }).catch((err) => {
                console.log('Service Worker SUPPORTED. ERROR', err)
            })
        } else {
            console.log('Service Worker NOT-SUPPORTED')
        }
    </script>`
}