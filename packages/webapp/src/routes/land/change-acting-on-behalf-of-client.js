import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_ACTING_ON_BEHALF_OF_CLIENT)
  },
  post: async (request, h) => {
    const { changeActingOnBehalfOfClient } = request.payload

    if (changeActingOnBehalfOfClient === 'yes') {
      request.yar.clear(constants.redisKeys.IS_AGENT)
      request.yar.clear(constants.redisKeys.LANDOWNER_TYPE)
      request.yar.clear(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
      request.yar.clear(constants.redisKeys.IS_ADDRESS_UK_KEY)
      request.yar.clear(constants.redisKeys.UK_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      request.yar.clear(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY)
      request.yar.clear(constants.redisKeys.REFERER)

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
