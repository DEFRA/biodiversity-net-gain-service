import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const getLandownerType = (landownerType) => {
  switch (landownerType) {
    case constants.landownerTypes.INDIVIDUAL:
      return 'yes'
    case constants.landownerTypes.ORGANISATION:
      return 'no'
    default:
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CLIENT_INDIVIDUAL_ORGANISATION
    })
    return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, {
      landownerType: getLandownerType(request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY))
    })
  },
  post: async (request, h) => {
    const { landownerType } = request.payload

    if (!landownerType) {
      return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select if your client is an individual or organisation',
          href: '#landownerType'
        }]
      })
    }

    // Force replay of full journey if switching between individual and organisation client types
    if (request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY) !== landownerType) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    request.yar.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY, landownerType)

    if (landownerType === constants.landownerTypes.INDIVIDUAL) {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CLIENTS_NAME)
    } else {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CLIENTS_ORGANISATION_NAME)
    }
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
