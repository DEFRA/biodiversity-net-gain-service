import Cookie from '@hapi/cookie'
import { DEFRA_ID, COOKIE_IS_SECURE } from '../utils/config.js'

const authentication = {
  plugin: {
    name: 'authentication',
    register: async (server, _options) => {
      await server.register(Cookie)
      server.auth.strategy('session-auth', 'cookie', {
        cookie: {
          name: 'session-auth',
          path: '/',
          password: DEFRA_ID.DEFRA_ID_SESSION_COOKIE_PASSWORD,
          isSecure: COOKIE_IS_SECURE,
          isSameSite: 'Lax',
          ttl: 60 * 60 * 1000
        },
        keepAlive: true,
        redirectTo: '/signin',
        appendNext: true
      })
      // sets all routes to default to session auth
      server.auth.default('session-auth')
    }
  }
}

export default authentication