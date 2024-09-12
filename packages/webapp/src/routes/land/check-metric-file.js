import constants from '../../utils/constants.js'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import path from 'path'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)

    // Determine the URL based on whether both metrics have been uploaded
    const changeMetricUrl = context.bothMetricsUploaded
      ? `${context.urlPath}/change-registration-metric`
      : `${context.urlPath}/check-metric-file`

    // Redirect to the appropriate URL if it's different from the current path
    if (request.path !== changeMetricUrl) {
      return h.redirect(changeMetricUrl)
    }

    return h.view(constants.views.CHECK_UPLOAD_METRIC, context)
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.CHECK_UPLOAD_METRIC, {
        ...getContext(request),
        err: [e]
      })
    })
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)

  // Determine if both metrics have been uploaded
  const bothMetricsUploaded = request.yar.get(constants.redisKeys.METRIC_LOCATION) && request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)

  // Determine the URL path based on the route
  const urlPath = (request?._route?.path || '').startsWith('/combined-case') ? '/combined-case' : '/land'

  return {
    filename: fileLocation ? path.basename(fileLocation) : '',
    yesSelection: request.yar.get(constants.redisKeys.METRIC_UPLOADED_ANSWER),
    fileSize: humanReadableFileSize,
    bothMetricsUploaded,
    urlPath
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_UPLOAD_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_UPLOAD_METRIC,
  handler: handlers.post
}]
