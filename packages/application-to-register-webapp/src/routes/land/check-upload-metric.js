import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = 'check-land-boundary-correct'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_UPLOAD_METRIC, context)
  },
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
      return h.redirect('/' + constants.views.CHECK_UPLOAD_METRIC, {
        ...await getContext(request),
        err: { text: '!TODO: Journey continuation not implemented' }
      })
    } else {
      return h.view(constants.views.CHECK_UPLOAD_METRIC, {
        filename: path.basename(metricUploadLocation),
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

const getContext = async request => {
  const fileLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.METRIC_FILE_SIZE)
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
