import constants from '../../credits/constants.js'

export default [
  {
    method: 'GET',
    path: constants.creditPurchaseRoutes.ESTIMATOR_CREDITS_INDIVIDUAL_ORG,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(constants.views.ESTIMATOR_CREDITS_INDIVIDUAL_ORG)
  }
]
