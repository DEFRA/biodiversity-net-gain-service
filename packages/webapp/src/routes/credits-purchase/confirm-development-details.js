import path from 'path'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const href = '#dev-details-checked-yes'
const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS, context)
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_CHECKED, confirmDevDetails)
    if (confirmDevDetails === creditsPurchaseConstants.creditsCheckDetails.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
    } else if (confirmDevDetails === creditsPurchaseConstants.creditsCheckDetails.YES) {
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    } else {
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS, {
        filename: path.basename(metricUploadLocation),
        ...await getContext(request),
        err: [
          {
            text: 'Select yes if these details are correct',
            href
          }
        ]
      })
    }
  }
}

const getContext = request => request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA)

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
