import CatboxRedis from '@hapi/catbox-redis'
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '../utils/config.js'

const cache = [{
  name: 'redis_cache',
  provider: {
    constructor: CatboxRedis,
    options: {
      partition: 'webapp',
      host: REDIS_HOST,
      port: REDIS_PORT,
      password: REDIS_PASSWORD
      // ,
      // tls: { checkServerIdentity: () => undefined }
    }
  }
}]

export default cache
