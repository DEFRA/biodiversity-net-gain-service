import path from 'path'
import constants from '../../utils/constants.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus, getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.HABITAT_INFO)
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    if (registrationTaskStatus !== 'COMPLETED') {
      return isCombinedCase
        ? h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
        : h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }

    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)

    // Determine if both metrics have been uploaded
    const bothMetricsUploaded = request.yar.get(constants.redisKeys.METRIC_LOCATION) && request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)

    return h.view(constants.views.CHECK_METRIC_DETAILS, {
      filename: path.basename(metricUploadLocation),
      urlPath: isCombinedCase ? '/combined-case' : '/land',
      changeMetricUrl: bothMetricsUploaded ? '/change-registration-metric' : '/check-metric-file'
    })
  },
  post: async (request, h) => {
    return getNextStep(request, h)
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
