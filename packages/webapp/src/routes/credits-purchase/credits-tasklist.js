import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASKLIST,
  handler: (_req, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_TASKLIST)
}]
