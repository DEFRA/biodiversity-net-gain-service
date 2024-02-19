import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_APPLYING_INDIVIDIAL_ORGANISATION,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_APPLYING_INDIVIDIAL_ORGANISATION)
  }
]
