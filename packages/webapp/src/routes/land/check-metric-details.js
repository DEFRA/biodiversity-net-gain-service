import path from 'path'
import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const metricUploadLocation = request.yar.get(constants.cacheKeys.METRIC_LOCATION)
    return h.view(constants.views.CHECK_METRIC_DETAILS, {
      filename: path.basename(metricUploadLocation)
    })
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.post
}]
