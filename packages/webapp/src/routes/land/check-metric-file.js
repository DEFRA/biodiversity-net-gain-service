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

    // If the metric file is changing then we clear any previously matched habitats as they're no longer valid
    if (checkUploadMetric === constants.CHECK_UPLOAD_METRIC_OPTIONS.NO) {
      request.yar.clear(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
      request.yar.clear(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)
    }

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
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    yesSelection: request.yar.get(constants.redisKeys.METRIC_UPLOADED_ANSWER),
    fileSize: humanReadableFileSize
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
