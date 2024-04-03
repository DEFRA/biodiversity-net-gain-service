import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION)
  },
  post: async (request, h) => {
    const { changeApplyingIndividualOrganisation } = request.payload

    if (changeApplyingIndividualOrganisation === 'yes') {
      request.yar.clear(constants.cacheKeys.LANDOWNER_TYPE)
      request.yar.clear(constants.cacheKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
      request.yar.clear(constants.cacheKeys.IS_ADDRESS_UK_KEY)
      request.yar.clear(constants.cacheKeys.UK_ADDRESS_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_NAME_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_ORGANISATION_NAME_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_EMAIL_ADDRESS_KEY)
      request.yar.clear(constants.cacheKeys.CLIENTS_PHONE_NUMBER_KEY)
      request.yar.clear(constants.cacheKeys.REFERER)

      return h.redirect(constants.routes.APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
    } else if (changeApplyingIndividualOrganisation === 'no') {
      return h.redirect(constants.routes.CHECK_APPLICANT_INFORMATION)
    } else {
      return h.view(constants.views.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION, {
        err: [{
          text: 'Select yes if you want to change whether you’re applying as an individual or an organisation',
          href: '#changeApplyingIndividualOrganisation'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHANGE_APPLYING_INDIVIDUAL_ORGANISATION,
  handler: handlers.post
}]
