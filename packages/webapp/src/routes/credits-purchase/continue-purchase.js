import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { getCreditsPurchase } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => getCreditsPurchase(request, h)
}

export default [{
  method: 'GET',
  path: `${creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONTINUE_PURCHASE}/{path*}`,
  handler: handlers.get
}]
