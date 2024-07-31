import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, {
      individualOrOrganisation: request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    })
  },
  post: async (request, h) => {
    const { individualOrOrganisation } = request.payload

    if (!individualOrOrganisation) {
      return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select if your client is an individual or organisation',
          href: '#individualOrOrganisation'
        }]
      })
    }

    // Force replay of full journey if switching between individual and organisation client types
    if (request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY) !== individualOrOrganisation) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    request.yar.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, individualOrOrganisation)
    return getNextStep(request, h)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
