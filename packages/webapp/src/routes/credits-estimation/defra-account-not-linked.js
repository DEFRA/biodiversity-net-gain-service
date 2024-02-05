import constants from '../../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED,
  handler: (_request, h) => h.view(constants.views.ESTIMATOR_CREDITS_DEFRA_ACCOUNT_NOT_LINKED)
}]
