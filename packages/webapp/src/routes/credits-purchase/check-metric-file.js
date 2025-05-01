import path from 'path'
import { getHumanReadableFileSize, getValidReferrerUrl } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const getContext = request => {
  const fileLocation = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION)
  const fileSize = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize, 1)
  const checkUploadMetric = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_CHECKED)
  let yesSelection = false
  if (checkUploadMetric === 'yes') {
    yesSelection = true
  }
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    yesSelection
  }
}

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)

    const errors = request.yar.get('errors') || null
    request.yar.clear('errors')

    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC, {
      ...context,
      err: errors,
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
      const referrerUrl = getValidReferrerUrl(request.yar, ['/credits-purchase/check-and-submit'])
      return h.redirect(referrerUrl || creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    }
    request.yar.set('errors', [{
      text: 'Select yes if this is the statutory biodiversity metric file your local planning authority reviewed with your biodiversity net gain statement',
      href: '#check-upload-correct-yes'
    }])
    return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
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
