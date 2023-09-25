import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_NEED_METRIC,
  handler: (_request, h) => h.view(constants.views.DEVELOPER_NEED_METRIC)
}
