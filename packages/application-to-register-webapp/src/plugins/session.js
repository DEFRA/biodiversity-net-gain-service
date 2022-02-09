// TODO: add configuration to config object
import Yar from '@hapi/yar'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: 'the-password-must-be-at-least-32-characters-long',
      isSecure: true
    },
    maxCookieSize: 0,
    cache: {
      cache: 'redis_cache',
      expiresIn: 24 * 60 * 60 * 1000
    }
  }
}

export default session
