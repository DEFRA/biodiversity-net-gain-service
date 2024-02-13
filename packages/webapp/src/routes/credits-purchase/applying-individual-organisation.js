import constants from '../../utils/constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const individualSignInErrorMessage = 'Select \'individual\' if you are purchasing statutory biodiversity credits as an individual'

const organisationSignInErrorMessage = 'Select \'organisation\' if you are purchasing statutory biodiversity credits as an organisation'

const getContext = request => {
  return {
    userType: request.yar.get(constants.redisKeys.CREDITS_USER_TYPE)
  }
}

const getErrorView = (h, request, errorMessage) => {
  return h.view(constants.views.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, {
    err: [{
      text: errorMessage,
      href: '#creditsIndividualOrganisation'
    }],
    ...getContext(request)
  })
}

const processOrganisationLandownerError = (h, request, noOrganisationsLinkedToDefraAccount) => {
  if (noOrganisationsLinkedToDefraAccount) {
    return h.redirect(constants.routes.CREDITS_DEFRA_ACCOUNT_NOT_LINKED)
  } else {
    return getErrorView(h, request, individualSignInErrorMessage)
  }
}

const handlers = {
  get: async (request, h) => {
    const userType = request.yar.get(constants.redisKeys.CREDITS_USER_TYPE)
    return h.view(constants.views.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION, { userType })
  },
  post: async (request, h) => {
    const userType = request.payload.userType
    if (userType) {
      request.yar.set(constants.redisKeys.CREDITS_USER_TYPE, userType)
      const { noOrganisationsLinkedToDefraAccount, currentOrganisation: organisation } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)

      if ((userType === constants.landownerTypes.INDIVIDUAL && !organisation) || (userType === constants.landownerTypes.ORGANISATION && organisation)) {
        return h.redirect(constants.routes.CREDITS_APPLICANT_CONFIRM)
      } else if (userType === constants.landownerTypes.INDIVIDUAL) {
        return getErrorView(h, request, organisationSignInErrorMessage)
      } else {
        return processOrganisationLandownerError(h, request, noOrganisationsLinkedToDefraAccount)
      }
    } else {
      return getErrorView(h, request, 'Select if you are applying as an individual or as part of an organisation')
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
  handler: handlers.post
}]
