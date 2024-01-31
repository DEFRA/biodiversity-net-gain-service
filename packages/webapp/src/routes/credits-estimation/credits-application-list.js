import constants from '../../credits/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.ESTIMATOR_CREDITS_APPLICATION_LIST,
    options: {
      auth: false
    },
    handler: (_req, h) => h.view(constants.views.ESTIMATOR_CREDITS_APPLICATION_LIST)
  }
]
