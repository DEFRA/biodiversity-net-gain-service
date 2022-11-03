import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = '#dev-details-checked-yes'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'untrusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmDevDetails === 'yes') {
      return h.redirect('/' + constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, {
        err: { text: '!TODO: Journey continuation not implemented' }
      })
    } else {
      return h.view(constants.views.DEVELOPER_CHECK_UPLOAD_METRIC, {
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
  return {
    startPage: request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA).startPage
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
