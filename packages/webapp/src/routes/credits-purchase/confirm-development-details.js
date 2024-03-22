import path from 'path'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'
import { checked } from '../../utils/helpers.js'

const href = '#dev-details-checked-yes'
const handlers = {
  get: (request, h) => {
    const metricData = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA)
    const confirmDevDetails = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DETAILS_CONFIRMED)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS, {
      ...metricData,
      confirmDevDetails,
      checked,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC
    })
  },
  post: async (request, h) => {
    const confirmDevDetails = request.payload.confirmDevDetails
    const metricUploadLocation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DETAILS_CONFIRMED, confirmDevDetails)
    if (confirmDevDetails === creditsPurchaseConstants.creditsCheckDetails.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
    } else if (confirmDevDetails === creditsPurchaseConstants.creditsCheckDetails.YES) {
      return h.redirect(request.yar.get(creditsPurchaseConstants.redisKeys.REFERER, true) || creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    } else {
      const metricData = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA)
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS, {
        ...metricData,
        confirmDevDetails,
        checked,
        filename: path.basename(metricUploadLocation),
        backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC,
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

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS,
  handler: handlers.post
}]
