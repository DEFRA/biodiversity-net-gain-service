import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { CACHE_MAX_BYTE_SIZE, CACHE_CLEANUP_INT_MIN_SEC, CACHE_CLONE_BUFFER_ON } from '../utils/config.js'

const options = {}
if (CACHE_MAX_BYTE_SIZE) {
  options.maxByteSize = CACHE_MAX_BYTE_SIZE
}
if (CACHE_CLEANUP_INT_MIN_SEC) {
  options.minCleanupIntervalMsec = CACHE_CLEANUP_INT_MIN_SEC
}
if (CACHE_CLONE_BUFFER_ON) {
  options.cloneBuffersOnGet = CACHE_CLONE_BUFFER_ON
}

const cache = [{
  name: 'memory_cache',
  provider: {
    constructor: CatboxMemory,
    options
  }
}]

export default cache
