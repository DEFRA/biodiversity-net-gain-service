import constants from '../../utils/constants.js'
import getApplicantContext from '../../utils/get-applicant-context.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_DEFRA_ACCOUNT_DETAILS, getApplicantContext(request.auth.credentials.account, request.yar))
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}]
