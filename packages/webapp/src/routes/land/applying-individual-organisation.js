import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, getContext(request))
  },
  post: async (request, h) => {
    const individualOrOrganisation = request.payload.individualOrOrganisation
    if (individualOrOrganisation) {
      request.yar.set(constants.redisKeys.LANDOWNER_TYPE, individualOrOrganisation)
    }

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, {
        err: [e],
        ...getContext(request)
      })
    })
  }
}

const getContext = request => {
  return {
    individualOrOrganisation: request.yar.get(constants.redisKeys.LANDOWNER_TYPE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.post
}]
