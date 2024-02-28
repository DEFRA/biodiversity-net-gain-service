import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLICANT_CONFIRM,
  handler: (_request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_APPLICANT_CONFIRM)
}]
