import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat baseline, creation and enhancements'
    }, {
      inProgressUrl: constants.routes.CHECK_UPLOAD_METRIC
    })
    return h.view(constants.views.CHECK_UPLOAD_METRIC, getContext(request))
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === 'no') {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.METRIC_LOCATION)
      return h.redirect(constants.routes.UPLOAD_METRIC)
    } else if (checkUploadMetric === 'yes') {
      request.yar.set(constants.redisKeys.METRIC_UPLOADED_ANSWER, true)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_HABITAT_BASELINE)
    } else {
      return h.view(constants.views.CHECK_UPLOAD_METRIC, {
        filename: path.basename(metricUploadLocation),
        ...getContext(request),
        err: [
          {
            text: 'Select yes if this is the correct file',
            href
          }
        ]
      })
    }
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
