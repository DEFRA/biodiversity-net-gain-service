import getApplicantContext from '../utils/get-applicant-context.js'
import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const { representing } = getApplicantContext(request.auth.credentials.account, request.yar)
    return h.view(constants.views.MANAGE_BIODIVERSITY_GAINS, {
      representing,
      enableDev: process.env.ENABLE_ROUTE_SUPPORT_FOR_DEV_JOURNEY === 'Y'
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.MANAGE_BIODIVERSITY_GAINS,
  handler: handlers.get
}]
