import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(constants.views.CREDITS_APPLICATION_BY_INDIVIDUAL_OR_ORGANISATION)
  }
]
