import constants from '../../utils/credits-estimation-constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_CONFIRMATION,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(constants.views.ESTIMATOR_CREDITS_CONFIRMATION)
  }
]
