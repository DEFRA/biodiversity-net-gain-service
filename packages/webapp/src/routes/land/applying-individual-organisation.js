import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, getContext(request))
  }
}

const getContext = request => {
  return {
    applicantType: request.yar.get(constants.redisKeys.REGISTRATION_APPLICANT_TYPE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.get
}]
