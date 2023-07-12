import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNIN_CALLBACK,
  options: {
    auth: {
      mode: 'try'
    },
    handler: async (request, h) => {
      await auth.authenticate(request.query.code, request.cookieAuth)
      return h.redirect('/')
    }
  }
}]
