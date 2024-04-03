import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_ACTING_ON_BEHALF_OF_CLIENT)
  },
  post: async (request, h) => {
    const { changeActingOnBehalfOfClient } = request.payload

    if (changeActingOnBehalfOfClient === 'yes') {
      request.yar.clear(constants.cacheKeys.IS_AGENT)
      request.yar.clear(constants.cacheKeys.LANDOWNER_TYPE)
      request.yar.clear(constants.cacheKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
      request.yar.clear(constants.cacheKeys.IS_ADDRESS_UK_KEY)
      request.yar.clear(constants.cacheKeys.UK_ADDRESS_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_NAME_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_ORGANISATION_NAME_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_PHONE_NUMBER_KEY)
      request.yar.clear(constants.cacheKeys.REFERER)

      return h.redirect(constants.routes.AGENT_ACTING_FOR_CLIENT)
    } else if (changeActingOnBehalfOfClient === 'no') {
      return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
    } else {
      return h.view(constants.views.CHANGE_ACTING_ON_BEHALF_OF_CLIENT, {
        err: [{
          text: 'Select yes if you want to change whether you’re acting on behalf of a client',
          href: '#changeActingOnBehalfOfClient'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHANGE_ACTING_ON_BEHALF_OF_CLIENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHANGE_ACTING_ON_BEHALF_OF_CLIENT,
  handler: handlers.post
}]
