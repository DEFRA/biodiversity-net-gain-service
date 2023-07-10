import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.NEED_LOCAL_SEARCH,
  handler: (_request, h) => h.view(constants.views.NEED_LOCAL_SEARCH)
}
