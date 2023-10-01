import auth from '../utils/auth.js'
import constants from '../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNIN_ALT,
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      request.yar.set(constants.redisKeys.PRE_AUTHENTICATION_ROUTE, request.query.next)

      // Redirect to authUrl
      const authUrl2 = await auth.getAuthenticationUrl2(request)
      console.log(authUrl2)
      return h.redirect(authUrl2)
    }
  }
}]
