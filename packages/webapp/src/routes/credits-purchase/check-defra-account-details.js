import getOrganisationDetails from '../../utils/get-organisation-details.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getValidReferrerUrl } from '../../utils/helpers.js'
const backLink = creditsPurchaseConstants.routes.CREDITS_PURCHASE_INDIVIDUAL_OR_ORG

const getUserDetails = request => {
  const userType = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
  const claims = request.auth.credentials.account.idTokenClaims
  const { currentOrganisation } = getOrganisationDetails(claims)
  const currentUser = `${claims.firstName} ${claims.lastName}`
  const applicantDetails = currentOrganisation || currentUser

  return {
    userType,
    currentOrganisation,
    applicantDetails
  }
}

const handlers = {
  get: async (request, h) => {
    // Clear any previous confirmation every time this page is accessed as part of forcing the user to confirm
    // their account details are correct based on who they are representing in the current session.
    request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED)

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS, {
      ...getUserDetails(request),
      backLink
    })
  },
  post: async (request, h) => {
    const defraAccountDetailsConfirmed = request.payload.defraAccountDetailsConfirmed
    if (defraAccountDetailsConfirmed) {
      request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_DEFRA_ACCOUNT_DETAILS_CONFIRMED, defraAccountDetailsConfirmed)
      const userType = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_USER_TYPE)
      const referrerUrl = getValidReferrerUrl(request.yar, creditsPurchaseConstants.CREDITS_PURCHASE_CDD_VALID_REFERRERS)
      if (userType === creditsPurchaseConstants.applicantTypes.INDIVIDUAL) {
        return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_MIDDLE_NAME)
      } else {
        return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
      }
    } else {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS, {
        ...getUserDetails(request),
        backLink,
        err: [{
          text: 'You must confirm your Defra account details are up to date',
          href: '#defraAccountDetailsConfirmed'
        }]
      })
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.post
}]
