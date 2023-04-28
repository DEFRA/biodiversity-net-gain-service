import constants from '../../utils/constants.js'
import path from 'path'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Upload Biodiversity Metric'
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
      processRegistrationTask(request, { taskTitle: 'Habitat information', title: 'Upload Biodiversity Metric' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
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
  const humanReadableFileSize = parseFloat(parseFloat(fileSize / 1024 / 1024).toFixed(2))
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    yesSelection: request.yar.get(constants.redisKeys.METRIC_UPLOADED_ANSWER),
    fileSize,
    humanReadableFileSize
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_UPLOAD_METRIC,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_UPLOAD_METRIC,
  handler: handlers.post
}]
