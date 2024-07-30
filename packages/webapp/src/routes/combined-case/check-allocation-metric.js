import constants from '../../utils/constants.js'
import { getDeveloperCheckMetricFileContext, checkDeveloperUploadMetric } from '../../utils/helpers.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC, context)
  },
  post: async (request, h) => {
    const matched = request.yar.get(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)

    return checkDeveloperUploadMetric(
      request,
      h,
      constants.routes.COMBINED_CASE_UPLOAD_ALLOCATION_METRIC,
      matched ? constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY : constants.routes.COMBINED_CASE_MATCH_HABITATS,
      constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC,
      href
    )
  }
}

const getContext = request => {
  return getDeveloperCheckMetricFileContext(request)
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC,
  handler: handlers.post
}]
