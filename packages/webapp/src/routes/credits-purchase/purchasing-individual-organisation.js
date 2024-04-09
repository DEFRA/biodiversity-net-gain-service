import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const individualSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

const organisationSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`

const backLink = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST

const getContext = request => {
  return {
    userType: request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
  }
}

const getErrorView = (h, request, errorMessage) => {
  return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG, {
    backLink,
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
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG, {
      backLink,
      userType
    })
  },
  post: async (request, h) => {
    const userType = request.payload.userType
    if (userType) {
      const { noOrganisationsLinkedToDefraAccount, currentOrganisation: organisation } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)

      if ((userType === creditsPurchaseConstants.applicantTypes.INDIVIDUAL && !organisation) || (userType === creditsPurchaseConstants.applicantTypes.ORGANISATION && organisation)) {
        request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, userType)
        return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS)
      } else if (userType === creditsPurchaseConstants.applicantTypes.INDIVIDUAL) {
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
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG,
  handler: handlers.post
}]
