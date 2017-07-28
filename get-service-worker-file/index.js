import { getFile } from 'sp-isomorphic-utils'

export default (filename = 'service-worker.js') => getFile(filename)