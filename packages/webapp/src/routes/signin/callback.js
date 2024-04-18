import auth from '../../utils/auth.js'
import constants from '../../utils/constants.js'
import { getAuthenticatedUserRedirectUrl } from '../../utils/helpers.js'

export default [{
  method: 'GET',
  path: constants.routes.SIGNIN_CALLBACK,
  options: {
    auth: {
      mode: 'try'
    }
  },
  handler: async (request, h) => {
    const res = await auth.authenticate(request.query.code, request.cookieAuth)
    console.log('== IN CALLBACK ==')
    console.log(res)
    const auhenticatedUserRedirectUrl = getAuthenticatedUserRedirectUrl()
    console.log('== REDIRECT ==')
    console.log(auhenticatedUserRedirectUrl)
    return h.redirect(auhenticatedUserRedirectUrl)
  }
}]
