import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_APP_BY_INDIVIDUAL_OR_ORGANISATION,
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_APP_BY_INDIVIDUAL_OR_ORGANISATION)
  }
]
