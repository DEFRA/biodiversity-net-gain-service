import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { newCreditsPurchase } from '../../utils/new-application.js'

const handlers = {
  get: async (request, h) => newCreditsPurchase(request, h)
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_NEW_PURCHASE,
  handler: handlers.get
}]
