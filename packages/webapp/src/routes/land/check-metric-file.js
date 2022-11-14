import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { processCompletedRegistrationTask } from '../../utils/helpers.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => h.view(constants.views.CHECK_UPLOAD_METRIC, getContext(request)),
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.METRIC_LOCATION)
      return h.redirect(constants.routes.UPLOAD_METRIC)
    } else if (checkUploadMetric === 'yes') {
      request.yar.set(constants.redisKeys.METRIC_UPLOADED_ANSWER, true)
      processCompletedRegistrationTask(request, { taskTitle: 'Habitat information', title: 'Upload Biodiversity Metric 3.1' })
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.REGISTER_LAND_TASK_LIST)
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
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.METRIC_FILE_SIZE),
    yesSelection: request.yar.get(constants.redisKeys.METRIC_UPLOADED_ANSWER)
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
