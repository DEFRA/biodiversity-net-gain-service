import constants from '../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.ALLOCATION_METRIC_NO,
  handler: (_request, h) => h.view(constants.views.ALLOCATION_METRIC_NO)
}
