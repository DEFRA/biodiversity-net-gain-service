import constants from '../../utils/constants.js'
import { getValidReferrerUrl, getHumanReadableFileSize } from '../../utils/helpers.js'
import path from 'path'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_UPLOAD_METRIC, getContext(request))
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.cacheKeys.METRIC_LOCATION)
    request.yar.set(constants.cacheKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === 'no') {
      return h.redirect(constants.routes.UPLOAD_METRIC)
    } else if (checkUploadMetric === 'yes') {
      request.yar.set(constants.cacheKeys.METRIC_UPLOADED_ANSWER, true)
      const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_METRIC_VALID_REFERRERS)
      return h.redirect(referrerUrl || constants.routes.CHECK_HABITAT_BASELINE)
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
  const fileLocation = request.yar.get(constants.cacheKeys.METRIC_LOCATION)
  const fileSize = request.yar.get(constants.cacheKeys.METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    yesSelection: request.yar.get(constants.cacheKeys.METRIC_UPLOADED_ANSWER),
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
