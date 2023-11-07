import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const landownerType = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION)

    return h.view(constants.views.CLIENT_INDIVIDUAL_ORGANISATION, { landownerType })
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
    request.yar.set(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION, landownerType)

    if (landownerType === constants.landownerTypes.INDIVIDUAL) {
      return h.redirect(constants.routes.CLIENTS_NAME)
    } else {
      return h.redirect(constants.routes.CLIENTS_ORGANISATION_NAME)
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
