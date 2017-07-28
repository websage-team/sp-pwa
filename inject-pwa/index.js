import getFile from '../get-service-worker-file'

export default (filename = 'service-worker.js') => `
<script>
    if ('serviceWorker' in navigator) {
        // console.log('Service Worker SUPPORTED')
        navigator.serviceWorker.register(
            '${getFile(filename)}', {
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
</script>
`