import path from 'path'
import constants from '../../credits/constants.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#dev-details-checked-yes'
const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.CREDITS_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(constants.redisKeys.CREDITS_METRIC_LOCATION)
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === constants.creditsCheckDetails.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(constants.redisKeys.CREDITS_METRIC_LOCATION)
      return h.redirect(constants.routes.CREDITS_UPLOAD_METRIC)
    } else if (confirmDevDetails === constants.creditsCheckDetails.YES) {
      return h.redirect(constants.routes.CREDITS_UPLOAD_METRIC)
    } else {
      return h.view(constants.views.CREDITS_CONFIRM_DEV_DETAILS, {
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

const getContext = request => request.yar.get(constants.redisKeys.CREDITS_METRIC_DATA)

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CREDITS_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
