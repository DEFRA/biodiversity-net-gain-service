import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'
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

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.AGENT_ACTING_FOR_CLIENT, {
        isApplicantAgent,
        err: [e]
      })
    })
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
