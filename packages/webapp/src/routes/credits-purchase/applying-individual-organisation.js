import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

export default [
  {
    method: 'GET',
    path: creditsPurchaseConstants.routes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(creditsPurchaseConstants.views.ESTIMATOR_CREDITS_INDIVIDUAL_ORG)
  }
]
