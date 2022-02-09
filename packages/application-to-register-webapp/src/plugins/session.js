import Yar from '@hapi/yar'

const session = {
  plugin: Yar,
  options: {
    cookieOptions: {
      password: process.env.SESSION_COOKIE_PASSWORD,
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
