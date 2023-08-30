import Cookie from '@hapi/cookie'
import authentication from '../utils/auth.js'
import { DEFRA_ID, COOKIE_IS_SECURE } from '../utils/config.js'

const strategy = 'session-auth'

const auth = {
  name: 'auth',
  register: async (server, _options) => {
    await server.register(Cookie)
    server.auth.strategy(strategy, 'cookie', {
      cookie: {
        name: strategy,
        path: '/',
        password: DEFRA_ID.DEFRA_ID_SESSION_COOKIE_PASSWORD,
        isSecure: COOKIE_IS_SECURE,
        isSameSite: 'Lax',
        ttl: 60 * 60 * 1000 // access token from defraID has 20 min expiry, so 60min ttl is irrelevant
      },
      keepAlive: false, // BNGP-3530 if ttl is true then the validate function is overwriting the new session-auth cookie with previous
      redirectTo: '/signin',
      appendNext: true,
      validate: async (request, session) => {
        // Check session token still has an account and non expired (20 mins expiry from Defra ID)
        if (!validateSession(session)) {
          if (session.account) {
            // if we have an account then attempt refresh, if silently fails and will attempt reauthentication
            const token = await authentication.refresh(session.account, request.cookieAuth, false)
            // if refresh succeeds continue and return isValid
            return {
              isValid: true,
              credentials: {
                account: token.account
              }
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
    server.auth.default(strategy)
  }
}

const validateSession = session => session.account && new Date().getTime() < session.account.idTokenClaims.exp * 1000

export default auth
