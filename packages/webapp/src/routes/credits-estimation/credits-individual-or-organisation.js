import { views, creditPurchaseRoutes } from '../../credits/constants.js'

export default [
  {
    method: 'GET',
    path: creditPurchaseRoutes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(views.ESTIMATOR_CREDITS_INDIVIDUAL_ORG)
  }
]
