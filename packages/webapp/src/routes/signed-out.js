import constants from '../utils/constants.js'

const signedOut = {
  method: 'GET',
  path: constants.routes.SIGNED_OUT,
  options: {
    auth: false
  },
  handler: (_request, h) => h.view(constants.views.SIGNED_OUT)
}

export default signedOut
