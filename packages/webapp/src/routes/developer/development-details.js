import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, checkUploadMetric)
    console.log('outside', checkUploadMetric)
    if (checkUploadMetric === 'no') {
      console.log('No', checkUploadMetric)
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (checkUploadMetric === 'yes') {
      console.log('yes', checkUploadMetric)
      return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, {
        ...await getContext(request),
        err: { text: '!TODO: Journey continuation not implemented' }
      })
    } else {
      console.log('Else', checkUploadMetric)
      return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, {
        filename: path.basename(metricUploadLocation),
        ...await getContext(request),
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
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
