import constants from '../../utils/constants.js'
import getApplicantContext from '../../utils/get-applicant-context.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS
    })
    // Clear any previous confirmation every time this page is accessed as part of forcing the user to confirm
    // their account details are correct based on who they are representing in the current session.
    request.yar.get(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, true)
    return h.view(constants.views.CHECK_DEFRA_ACCOUNT_DETAILS, getApplicantContext(request.auth.credentials.account, request.yar))
  },
  post: async (request, h) => {
    const defraAccountDetailsConfirmed = request.payload.defraAccountDetailsConfirmed
    if (defraAccountDetailsConfirmed) {
      request.yar.set(constants.redisKeys.DEFRA_ACCOUNT_DETAILS_CONFIRMED, defraAccountDetailsConfirmed)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || redirect(request.yar, h))
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

const redirect = (session, h) => {
  if (session.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES) {
    return constants.routes.CLIENT_INDIVIDUAL_ORGANISATION
  } else {
    return constants.routes.IS_ADDRESS_UK
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
