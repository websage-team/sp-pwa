import { getFile } from 'sp-isomorphic-utils'

export default (filename = 'service-worker.js', distPath) => getFile(filename, distPath)