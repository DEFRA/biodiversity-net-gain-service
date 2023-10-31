import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import constants from '../../credits/constants.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.CREDITS_CHECK_UPLOAD_METRIC, context)
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.CREDITS_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === constants.creditsCheckUploadMetric.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.CREDITS_METRIC_LOCATION)
      return h.redirect(constants.routes.CREDITS_UPLOAD_METRIC)
    } else if (checkUploadMetric === constants.creditsCheckUploadMetric.YES) {
      return h.redirect(constants.routes.CREDITS_CONFIRM_DEV_DETAILS)
    }
    return h.view(constants.views.CREDITS_CHECK_UPLOAD_METRIC, {
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

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.CREDITS_METRIC_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.CREDITS_METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize, 1)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_CHECK_UPLOAD_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CREDITS_CHECK_UPLOAD_METRIC,
  handler: handlers.post
}]
