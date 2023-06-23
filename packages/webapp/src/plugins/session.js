import Yar from '@hapi/yar'
import { SESSION_COOKIE_PASSWORD, COOKIE_IS_SECURE } from '../utils/config.js'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: SESSION_COOKIE_PASSWORD,
      isSecure: COOKIE_IS_SECURE
    },
    maxCookieSize: 0,
    cache: {
      cache: 'redis_cache',
      expiresIn: 24 * 60 * 60 * 1000,
      segment: 'session'
    }
  }
}

export default session
