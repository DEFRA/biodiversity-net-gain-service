import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'
const backLink = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST

const processSuccessfulCreditUpload = async (result, request, h) => {
  const creditsValidationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation)
  if (creditsValidationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
      ...creditsValidationError,
      backLink
    })
  }

  request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(creditsPurchaseConstants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
}

const processCreditsErrorUpload = (err, h) => {
  switch (err.message) {
    case creditsPurchaseConstants.uploadErrors.emptyFile:
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
        backLink,
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsPurchaseConstants.uploadErrors.noFile:
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
        backLink,
        err: [{
          text: `Upload the statutory biodiversity
          metric file with the ‘unit shortfall
          summary’ tab`,
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsPurchaseConstants.uploadErrors.unsupportedFileExt:
      return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
        backLink,
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsPurchaseConstants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
          backLink,
          err: [{
            text: creditsPurchaseConstants.uploadErrors.malwareScanFailed,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
          backLink,
          err: [{
            text: creditsPurchaseConstants.uploadErrors.threatDetected,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else {
        return h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
          backLink,
          err: [{
            text: creditsPurchaseConstants.uploadErrors.uploadFailure,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      }
  }
}

const handlers = {
  get: async (request, h) => h.view(creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC, { backLink }),
  post: async (request, h) => {
    // Get upload config object from common code
    const creditsUploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: creditsPurchaseConstants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: creditsPurchaseConstants.uploadTypes.CREDITS_PURCHASE_METRIC_UPLOAD_TYPE,
      postProcess: true
    })

    try {
      const metricUploadResult = await uploadFile(request.logger, request, creditsUploadConfig)
      return processSuccessfulCreditUpload(metricUploadResult, request, h)
    } catch (err) {
      request.logger.info(`${new Date().toUTCString()} Problem uploading credits metric file ${err}`)
      return processCreditsErrorUpload(err, h)
    }
  }
}

export default [{
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: creditsPurchaseConstants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      output: 'stream',
      multipart: true,
      timeout: false,
      parse: false,
      allow: 'multipart/form-data',
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      failAction: (req, h, err) => {
        req.logger.info(`${new Date().toUTCString()} File upload too large ${req.path}`)

        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: creditsPurchaseConstants.views.CREDITS_PURCHASE_UPLOAD_METRIC,
    href: UPLOAD_CREDIT_METRIC_ID,
    h
  })
}
