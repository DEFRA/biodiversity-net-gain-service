import auth from '../utils/auth.js'
import constants from '../utils/constants.js'
import Joi from 'joi'

export default [{
  method: 'GET',
  path: constants.routes.SIGNIN,
  options: {
    auth: {
      mode: 'try'
    },
    validate: {
      query: Joi.object({
        reselect: Joi.boolean(),
        next: Joi.string()
      })
    },
    handler: async (request, h) => {
      const { reselect } = request.query
      if (!reselect) {
        // If we are authenticated then return to page requested
        if (request.auth.isAuthenticated) {
          return h.redirect(request.query.next)
        } else if (request.query.next) {
          // Cache the requested route for use during redirection processing after signing in.
          request.yar.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, request.query.next)
        } else {
          request.yar.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, '/land')
        }
      }

      // Redirect to authUrl
      const authUrl = await auth.getAuthenticationUrl(request)
      return h.redirect(authUrl)
    }
  }
}]
