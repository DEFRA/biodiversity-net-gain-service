import constants from '../../utils/constants.js'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import path from 'path'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_UPLOAD_METRIC, getContext(request))
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.CHECK_UPLOAD_METRIC, {
        filename: path.basename(metricUploadLocation),
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

  const registrationMetricUploaded = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  const developerMetricUploaded = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)

  // Determine if both metrics have been uploaded
  const bothMetricsUploaded = Boolean(registrationMetricUploaded) && Boolean(developerMetricUploaded)

  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    yesSelection: request.yar.get(constants.redisKeys.METRIC_UPLOADED_ANSWER),
    fileSize: humanReadableFileSize,
    registrationMetricUploaded,
    developerMetricUploaded,
    bothMetricsUploaded
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
