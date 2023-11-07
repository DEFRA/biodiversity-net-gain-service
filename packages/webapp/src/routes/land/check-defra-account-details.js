import constants from '../../utils/constants.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_DEFRA_ACCOUNT_DETAILS, getApplicantContext(request.auth.credentials.account, request.yar))
  },
  post: async (request, h) => {
    const defraAccountDetailsConfirmed = request.payload.defraAccountDetailsConfirmed
    if (defraAccountDetailsConfirmed) {
      request.yar.set(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, defraAccountDetailsConfirmed)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.IS_ADDRESS_UK)
    } else {
      return h.view(constants.views.CHECK_DEFRA_ACCOUNT_DETAILS, {
        ...getApplicantContext(request.auth.credentials.account, request.yar),
        err: [{
          text: 'You must confirm your Defra account details are up to date',
          href: '#defraAccountDetailsConfirmed'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.post
}]
