import auth from '../utils/auth.js'
import constants from '../utils/constants.js'
import saveApplicationSessionIfNeeded from '../utils/save-application-session-if-needed.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNOUT,
  options: {
    handler: async (request, h) => {
      request.cookieAuth.clear()
      // Save unperisted journey data before signing out if needed but do not reset the session
      // until the user has signed out.
      // Abandon signing out if the attempt to persist journey data fails.
      await saveApplicationSessionIfNeeded(request.yar, false)
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
