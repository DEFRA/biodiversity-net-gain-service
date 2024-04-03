import { Engine as CatboxMemory } from '@hapi/catbox-memory'
import { CACHE_MAX_BYTE_SIZE, CACHE_CLEANUP_INT_MIN_SEC, CACHE_CLONE_BUFFER_ON } from '../utils/config.js'

const cache = [{
  name: 'memory_cache',
  provider: {
    constructor: CatboxMemory,
    options: {
      maxByteSize: CACHE_MAX_BYTE_SIZE,
      minCleanupIntervalMsec: CACHE_CLEANUP_INT_MIN_SEC,
      cloneBuffersOnGet: CACHE_CLONE_BUFFER_ON
    }
  }
}]

export default cache
