import constants from '../../utils/constants.js'

export default [
  {
    method: 'GET',
    path: constants.routes.PURCHASE_CREDITS_INDIVIDUAL_ORG,
    options: {
      auth: false
    },
    handler: (_request, h) => h.view(constants.views.PURCHASE_CREDITS_INDIVIDUAL_ORG)
  }
]
