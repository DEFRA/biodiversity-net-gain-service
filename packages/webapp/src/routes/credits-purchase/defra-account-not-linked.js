import constants from '../../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_DEFRA_ACCOUNT_NOT_LINKED,
  handler: (_request, h) => h.view(constants.views.CREDITS_DEFRA_ACCOUNT_NOT_LINKED)
}]
