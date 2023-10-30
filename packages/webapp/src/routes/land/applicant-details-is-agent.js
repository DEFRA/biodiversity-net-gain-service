import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      inProgressUrl: constants.routes.APPLICANT_DETAILS_IS_AGENT
    })

    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)

    return h.view(constants.views.APPLICANT_DETAILS_IS_AGENT, {
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const { isApplicantAgent } = request.payload

    if (isApplicantAgent === 'yes') {
      request.yar.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, isApplicantAgent)
      // TODO: change redirect route when next route dev work is complete
      return h.redirect(constants.routes.APPLICANT_DETAILS_IS_AGENT)
    } else if (isApplicantAgent === 'no') {
      request.yar.set(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT, isApplicantAgent)
      // TODO: change redirect route when next route dev work is complete
      return h.redirect(constants.routes.APPLICANT_DETAILS_IS_AGENT)
    } else {
      return h.view(constants.views.APPLICANT_DETAILS_IS_AGENT, {
        isApplicantAgent,
        err: [{
          text: 'Select yes if you want are an agent acting on behalf of a client',
          href: '#isApplicantAgent'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICANT_DETAILS_IS_AGENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.APPLICANT_DETAILS_IS_AGENT,
  handler: handlers.post
}]
