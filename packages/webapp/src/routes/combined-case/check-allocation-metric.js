import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC, context)
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === constants.CHECK_UPLOAD_METRIC_OPTIONS.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      request.yar.clear(constants.redisKeys.BIODIVERSITY_NET_GAIN_NUMBER)
      request.yar.clear(constants.redisKeys.DEVELOPER_OFF_SITE_GAIN_CONFIRMED)
      return h.redirect(constants.routes.COMBINED_CASE_MATCH_AVAILABLE_HABITATS)
    } else if (checkUploadMetric === constants.CHECK_UPLOAD_METRIC_OPTIONS.YES) {
      return h.redirect(constants.routes.COMBINED_CASE_MATCH_AVAILABLE_HABITATS)
    }
    return h.view(constants.views.COMBINED_CASE_CHECK_UPLOAD_ALLOCATION_METRIC, {
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
  const fileLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize, 1)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize
  }
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
