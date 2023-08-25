import auth from '../utils/auth.js'
import constants from '../utils/constants.js'
import { postJson } from '../utils/http.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNOUT,
  options: {
    handler: async (request, h) => {
      request.cookieAuth.clear()
      if (request.yar.get(constants.redisKeys.SAVE_APPLICATION_SESSION_ON_SIGNOUT)) {
        // Save unperisted journey data before signing out.
        // Abandon signing out if the attempt to persist journey data fails.
        await postJson(`${constants.AZURE_FUNCTION_APP_URL}/saveapplicationsession`, request.yar._store)
      }
      try {
        await auth.logout(request)
      } catch (err) {
        // Occasionally in development if stopping a node process this throws an error when auth cache is wiped
        console.log(err)
      } finally {
        // Reset the session to prevent a user from signing out during partial completion of a journey,
        // signing in using the same browser session and starting or continuing a journey for a different
        // application. If the session is not reset, data from multiple jouneys is merged in the same session.
        request.yar.reset()
      }
      return h.redirect(auth.getLogoutUrl().href)
    }
  }
}]
