import constants from '../utils/constants.js'

const signedOut = {
  method: 'GET',
  path: constants.routes.SIGNED_OUT,
  options: {
    auth: false
  },
  handler: (request, h) => {
    const app = request?.query?.app

    const options = {
      continueRegistration: app === constants.applicationTypes.REGISTRATION.toLowerCase(),
      continueAllocation: app === constants.applicationTypes.ALLOCATION.toLowerCase(),
      continueCredits: app === constants.applicationTypes.CREDITS_PURCHASE.toLowerCase(),
      continueCombinedCase: app === constants.applicationTypes.COMBINED_CASE.toLowerCase()
    }

    return h.view(constants.views.SIGNED_OUT, options)
  }
}

export default signedOut
