import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_APPLICATION_LIST,
    options: {
      auth: false
    },
    handler: (_req, h) => h.view(constants.views.CREDITS_APPLICATION_LIST)
  }
]
