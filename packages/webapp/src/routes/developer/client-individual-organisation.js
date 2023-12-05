import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, {
      individualOrOrganisation: request.yar.get(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    })
  },
  post: async (request, h) => {
    const { individualOrOrganisation } = request.payload

    if (!individualOrOrganisation) {
      return h.view(constants.views.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select if your client is an individual or organisation',
          href: '#individualOrOrganisation'
        }]
      })
    }

    // Force replay of full journey if switching between individual and organisation client types
    if (request.yar.get(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION) !== individualOrOrganisation) {
      request.yar.clear(constants.redisKeys.REFERER)
    }

    request.yar.set(constants.redisKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION, individualOrOrganisation)

    if (individualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL) {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_CLIENTS_NAME)
    } else {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_CLIENTS_ORGANISATION_NAME)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
