import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getContextForCreditsPurchase } from '../../utils/get-context-for-applications-by-type.js'
import getOrganisationDetails from '../../utils/get-organisation-details.js'

const handlers = {
  get: async (request, h) => {
    const { currentOrganisationId: organisationId } = getOrganisationDetails(request.auth.credentials.account.idTokenClaims)
    const context = await getContextForCreditsPurchase(request.auth.credentials.account.idTokenClaims.contactId, organisationId)

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_APPLICATION_LIST, {
      ...context
    })
  }
}

export default {
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICATION_LIST,
  handler: handlers.get
}
