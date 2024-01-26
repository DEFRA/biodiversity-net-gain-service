import auth from '../utils/auth.js'
import constants from '../utils/constants.js'
import { getAuthenticatedUserRedirectUrl } from '../utils/helpers.js'
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
        reselect: Joi.boolean()
      })
    },
    handler: async (request, h) => {
      const { reselect } = request.query
      if (!reselect) {
        // If we are authenticated then redirect to the URL for authenticated users.
        if (request.auth.isAuthenticated) {
          const auhenticatedUserRedirectUrl = getAuthenticatedUserRedirectUrl()
          return h.redirect(auhenticatedUserRedirectUrl)
        }
      }

      // Redirect to authUrl
      const authUrl = await auth.getAuthenticationUrl(request)
      return h.redirect(authUrl)
    }
  }
}]
