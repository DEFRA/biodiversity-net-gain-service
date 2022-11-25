import Yar from '@hapi/yar'
import { SESSION_COOKIE_PASSWORD } from '../utils/config.js'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: SESSION_COOKIE_PASSWORD,
      isSecure: true // This field value should be false while running locally
    },
    maxCookieSize: 0,
    cache: {
      cache: 'redis_cache',
      expiresIn: 24 * 60 * 60 * 1000
    }
  }
}

export default session
