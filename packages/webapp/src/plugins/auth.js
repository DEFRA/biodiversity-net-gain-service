import Cookie from '@hapi/cookie'
import auth from '../utils/auth.js'
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
        appendNext: true,
        validate: async (request, session) => {
          // Check session token still has an account and non expired (20 mins expiry from Defra ID)
          if (!session.account || new Date().getTime() >= session.account.idTokenClaims.exp * 1000) {
            if (session.account) {
              // if we have an account then attempt refresh
              await auth.refresh(session.account, request.cookieAuth, false)

              // TODO: what happens if refresh fails and doesn't reauthenticate properly?
              return {
                isValid: true
              }
            } else {
              // otherwise fail and request re-authentication
              return {
                isValid: false
              }
            }
          } else {
            return {
              isValid: true
            }
          }
        }
      })
      // sets all routes to default to session auth
      server.auth.default('session-auth')
    }
  }
}

export default authentication