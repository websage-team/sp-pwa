import getFilename from '../injection-filename'

export default (args) => {
    return `<script>
        if ('serviceWorker' in navigator) {
            // console.log('Service Worker SUPPORTED')
            navigator.serviceWorker.register(
                '${getFilename(args)}', {
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