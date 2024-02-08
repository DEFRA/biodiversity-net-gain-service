import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.creditPurchaseRoutes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.ESTIMATOR_CREDITS_INDIVIDUAL_ORG)
  }
]
