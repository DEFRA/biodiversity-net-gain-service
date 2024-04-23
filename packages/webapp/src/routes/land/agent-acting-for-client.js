import constants from '../../utils/constants.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)

    return h.view(constants.views.AGENT_ACTING_FOR_CLIENT, {
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const { isApplicantAgent } = request.payload

    // Force replay of full journey if switching between agent and non-agent application
    if (request.yar.get(constants.redisKeys.IS_AGENT) !== isApplicantAgent) {
      request.yar.clear(constants.redisKeys.REFERER)
    }
    request.yar.set(constants.redisKeys.IS_AGENT, isApplicantAgent)
    const referrerUrl = getValidReferrerUrl(request, constants.LAND_APPLICANT_INFO_VALID_REFERRERS)
    if (isApplicantAgent === 'yes') {
      return h.redirect(referrerUrl || constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS)
    } else if (isApplicantAgent === 'no') {
      return h.redirect(referrerUrl || constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    } else {
      return h.view(constants.views.AGENT_ACTING_FOR_CLIENT, {
        isApplicantAgent,
        err: [{
          text: 'Select yes if you are an agent acting on behalf of a client',
          href: '#isApplicantAgent'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.AGENT_ACTING_FOR_CLIENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.AGENT_ACTING_FOR_CLIENT,
  handler: handlers.post
}]
