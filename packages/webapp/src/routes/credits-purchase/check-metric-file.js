import path from 'path'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC, {
      ...context,
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC
    })
  },
  post: async (request, h) => {
    const checkUploadMetric = request.payload.checkUploadMetric
    const metricUploadLocation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
    request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_CHECKED, checkUploadMetric)
    if (checkUploadMetric === creditsPurchaseConstants.creditsCheckUploadMetric.NO) {
      await deleteBlobFromContainers(metricUploadLocation)
      request.yar.clear(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
    } else if (checkUploadMetric === creditsPurchaseConstants.creditsCheckUploadMetric.YES) {
      return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CONFIRM_DEV_DETAILS)
    }
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC, {
      filename: path.basename(metricUploadLocation),
      ...getContext(request),
      backLink: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
      err: [
        {
          text: 'Select yes if this is the statutory biodiversity metric file your local planning authority reviewed with your biodiversity net gain statement',
          href
        }
      ]
    })
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
  const fileSize = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize, 1)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC,
  handler: handlers.post
}]
