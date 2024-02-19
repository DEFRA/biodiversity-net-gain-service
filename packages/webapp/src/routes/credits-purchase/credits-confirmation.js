import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_PURCHASE_CONFIRMATION,
    handler: (_request, h) => h.view(constants.views.CREDITS_PURCHASE_CONFIRMATION)
  }
]
