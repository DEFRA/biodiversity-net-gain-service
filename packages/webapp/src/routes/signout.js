import auth from '../utils/auth.js'
import constants from '../utils/constants.js'
import saveApplicationSessionIfNeeded from '../utils/save-application-session-if-needed.js'

const determineApplicationTypeFromPath = request => {
  if (!request.headers.referer) {
    return null
  }

  const refererUrl = new URL(request.headers.referer)
  const journeyType = refererUrl.pathname.split('/')[1]

  switch (journeyType) {
    case 'land':
      return constants.applicationTypes.REGISTRATION
    case 'developer':
      return constants.applicationTypes.ALLOCATION
    case 'credits-purchase':
      return constants.applicationTypes.CREDITS_PURCHASE
    case 'combined-case':
      return constants.applicationTypes.COMBINED_CASE
    default:
      return null
  }
}

export default [{
  method: 'GET',
  path: constants.routes.SIGNOUT,
  options: {
    handler: async (request, h) => {
      const applicationType = request.yar.get(constants.redisKeys.APPLICATION_TYPE) || determineApplicationTypeFromPath(request)

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
      return h.redirect(auth.getLogoutUrl(applicationType).href)
    }
  }
}]
