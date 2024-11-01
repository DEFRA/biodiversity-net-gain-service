import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const individualSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an organisation because the Defra account you’re signed into is linked to an individual.
  Register for or sign into a Defra account representing an organisation before continuing this application`

const organisationSignInErrorMessage = `
  You cannot purchase statutory biodiversity credits as an individual because the Defra account you’re signed into is linked to an organisation.
  Register for or sign into a Defra account as yourself before continuing this application`

const backLink = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST

const setErrorMessages = (request, errorMessage) => {
  request.yar.set('errorMessages', [errorMessage])
  request.yar.set('errorList', [{ text: errorMessage, href: '#creditsIndividualOrganisation' }])
}

const processOrganisationLandownerError = (h, request, noOrganisationsLinkedToDefraAccount) => {
  if (noOrganisationsLinkedToDefraAccount) {
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_DEFRA_ACCOUNT_NOT_LINKED)
  } else {
    setErrorMessages(request, individualSignInErrorMessage)
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG).takeover()
  }
}

const handlers = {
  get: async (request, h) => {
    const errorMessages = request.yar.get('errorMessages') || null
    const errorList = request.yar.get('errorList') || null

    request.yar.clear('errorMessages')
    request.yar.clear('errorList')

    const userType = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG, {
      backLink,
      userType,
      errorMessages,
      err: errorList
    })
  },
  post: async (request, h) => {
    const userType = request.payload.userType

    if (!userType) {
      setErrorMessages(request, 'Select if you are applying as an individual or as part of an organisation')
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG).takeover()
    }

    const { noOrganisationsLinkedToDefraAccount, currentOrganisation: organisation } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)

    if ((userType === creditsPurchaseConstants.applicantTypes.INDIVIDUAL && !organisation) || (userType === creditsPurchaseConstants.applicantTypes.ORGANISATION && organisation)) {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE, userType)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS)
    } else if (userType === creditsPurchaseConstants.applicantTypes.INDIVIDUAL) {
      setErrorMessages(request, organisationSignInErrorMessage)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG).takeover()
    } else {
      return processOrganisationLandownerError(h, request, noOrganisationsLinkedToDefraAccount)
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
