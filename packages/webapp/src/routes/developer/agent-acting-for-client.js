import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT)
    return h.view(constants.views.DEVELOPER_AGENT_ACTING_FOR_CLIENT, {
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const { isApplicantAgent } = request.payload

    // Force replay of full journey if switching between agent and non-agent application
    if (request.yar.get(constants.redisKeys.DEVELOPER_IS_AGENT) !== isApplicantAgent) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    request.yar.set(constants.redisKeys.DEVELOPER_IS_AGENT, isApplicantAgent)

    if (isApplicantAgent === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_CHECK_DEFRA_ACCOUNT_DETAILS)
    } else if (isApplicantAgent === 'no') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_LANDOWNER_OR_LEASEHOLDER)
    } else {
      return h.view(constants.views.DEVELOPER_AGENT_ACTING_FOR_CLIENT, {
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
  path: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_AGENT_ACTING_FOR_CLIENT,
  handler: handlers.post
}]
