import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.NEED_LEGAL_AGREEMENT,
  handler: (_request, h) => h.view(constants.views.NEED_LEGAL_AGREEMENT)
}
