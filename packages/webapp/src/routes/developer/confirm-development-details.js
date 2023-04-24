import constants from '../../utils/constants.js'
import path from 'path'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { processDeveloperTask } from '../../utils/helpers.js'

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
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      return h.redirect(constants.routes.DEVELOPER_UPLOAD_METRIC)
    } else if (confirmDevDetails === constants.CONFIRM_DEVELOPMENT_DETAILS.YES) {
      processDeveloperTask(request, { taskTitle: 'Biodiversity 4.0 Metric calculations', title: 'Confirm development details' }, { status: constants.COMPLETE_DEVELOPER_TASK_STATUS })
      return h.redirect('/' + constants.views.DEVELOPER_TASKLIST)
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
