import { Engine } from '@hapi/catbox-memory'

// use catbox-memory cache strategy for testing
const serverOptions = {
  cache: [
    {
      name: 'memory_cache',
      provider: {
        constructor: Engine
      }
    }
  ]
}

export default serverOptions
