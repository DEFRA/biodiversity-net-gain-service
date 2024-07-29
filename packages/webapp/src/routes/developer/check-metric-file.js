import constants from '../../utils/constants.js'
import { getDeveloperCheckMetricFileContext, checkDeveloperUploadMetric } from '../../utils/helpers.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, context)
  },
  post: async (request, h) => {
    return checkDeveloperUploadMetric(
      request,
      h,
      constants.routes.DEVELOPER_BNG_NUMBER,
      constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
      constants.views.DEVELOPER_CHECK_UPLOAD_METRIC,
      href
    )
  }
}

const getContext = request => {
  return getDeveloperCheckMetricFileContext(request)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC,
  handler: addRedirectViewUsed(handlers.post)
}]
