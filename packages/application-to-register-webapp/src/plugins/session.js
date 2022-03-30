import Yar from '@hapi/yar'
import { SESSION_COOKIE_PASSWORD } from '../utils/config.js'

console.log(SESSION_COOKIE_PASSWORD)

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: SESSION_COOKIE_PASSWORD,
      isSecure: false // set to false to cover deployment to non SSL on azure container instances
    },
    maxCookieSize: 0,
    cache: {
      cache: 'redis_cache',
      expiresIn: 24 * 60 * 60 * 1000
    }
  }
}

export default session
