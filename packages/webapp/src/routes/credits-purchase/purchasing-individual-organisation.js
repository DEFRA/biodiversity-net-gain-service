import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const individualSignInErrorMessage = 'Select \'individual\' if you are purchasing statutory biodiversity credits as an individual'

const organisationSignInErrorMessage = 'Select \'organisation\' if you are purchasing statutory biodiversity credits as an organisation'

const getContext = request => {
  return {
    userType: request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
  }
}

const getErrorView = (h, request, errorMessage) => {
  return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_ORG, {
    err: [{
      text: errorMessage,
      href: '#creditsIndividualOrganisation'
    }],
    ...getContext(request)
  })
}

const processOrganisationLandownerError = (h, request, noOrganisationsLinkedToDefraAccount) => {
  if (noOrganisationsLinkedToDefraAccount) {
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED)
  } else {
    return getErrorView(h, request, individualSignInErrorMessage)
  }
}

const handlers = {
  get: async (request, h) => {
    const userType = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_ORG, { userType })
  },
  post: async (request, h) => {
    const userType = request.payload.userType
    if (userType) {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, userType)
      const { noOrganisationsLinkedToDefraAccount, currentOrganisation: organisation } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)

      if ((userType === creditsPurchaseConstants.landownerTypes.INDIVIDUAL && !organisation) || (userType === creditsPurchaseConstants.landownerTypes.ORGANISATION && organisation)) {
        return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICANT_CONFIRM)
      } else if (userType === creditsPurchaseConstants.landownerTypes.INDIVIDUAL) {
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
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_ORG,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_ORG,
  handler: handlers.post
}]
