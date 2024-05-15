import constants from '../utils/constants.js'

const signedOut = {
  method: 'GET',
  path: constants.routes.SIGNED_OUT,
  options: {
    auth: false
  },
  handler: (_request, h) => {
    const options = {
      continueRegistration: !_request?.query?.app,
      continueAllocation: _request?.query?.app === constants.applicationTypes.ALLOCATION.toLowerCase(),
      continueCredits: _request?.query?.app === constants.applicationTypes.CREDITS_PURCHASE.toLowerCase()
    }

    return h.view(constants.views.SIGNED_OUT, options)
  }
}

export default signedOut
