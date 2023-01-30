import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { processCompletedMetricTask } from '../../utils/helpers.js'

const href = '#dev-details-checked-yes'
const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === constants.CONFIRM_DEVELOPMENT_DETAILS.NO) {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: metricUploadLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmDevDetails === constants.CONFIRM_DEVELOPMENT_DETAILS.YES) {
      processCompletedMetricTask(request, { taskTitle: 'Biodiversity 3.1 Metric calculations', title: 'Confirm development details' })
      return h.redirect(constants.routes.DEVELOPER_METRIC_TASK_LIST)
    } else {
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

const getContext = request => request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
