import auth from '../utils/auth.js'
import constants from '../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNOUT,
  options: {
    handler: async (request, h) => {
      request.cookieAuth.clear()
      try {
        await auth.logout(request)
      } catch (err) {
        // Occasionally in development if stopping a node process this throws an error when auth cache is wiped
        console.log(err)
      }
      return h.redirect(auth.getLogoutUrl().href)
    }
  }
}]