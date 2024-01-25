// import { logger } from 'defra-logging-facade'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import creditsConstants from '../../credits/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'

const processSuccessfulCreditUpload = async (result, request, h) => {
  const creditsValidationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation)
  if (creditsValidationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, creditsValidationError)
  }

  request.yar.set(creditsConstants.redisKeys.CREDITS_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(creditsConstants.redisKeys.CREDITS_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(creditsConstants.redisKeys.CREDITS_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(creditsConstants.redisKeys.CREDITS_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(creditsConstants.redisKeys.CREDITS_METRIC_FILE_NAME, result.filename)
  request.logger.log(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(creditsConstants.routes.CREDITS_CHECK_UPLOAD_METRIC)
}

const processCreditsErrorUpload = (err, h) => {
  switch (err.message) {
    case creditsConstants.uploadErrors.emptyFile:
      return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsConstants.uploadErrors.noFile:
      return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'Select a Biodiversity Metric',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsConstants.uploadErrors.unsupportedFileExt:
      return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case creditsConstants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: creditsConstants.uploadErrors.malwareScanFailed,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: creditsConstants.uploadErrors.threatDetected,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else {
        return h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: creditsConstants.uploadErrors.uploadFailure,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      }
  }
}

const handlers = {
  get: async (_request, h) => h.view(creditsConstants.views.CREDITS_UPLOAD_METRIC),
  post: async (request, h) => {
    // Get upload config object from common code
    const creditsUploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: creditsConstants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: creditsConstants.uploadTypes.CREDITS_METRIC_UPLOAD_TYPE,
      postProcess: true
    })

    try {
      const metricUploadResult = await uploadFile(request.logger, request, creditsUploadConfig)
      return processSuccessfulCreditUpload(metricUploadResult, request, h)
    } catch (err) {
      request.logger.log(`${new Date().toUTCString()} Problem uploading credits metric file ${err}`)
      return processCreditsErrorUpload(err, h)
    }
  }
}

export default [{
  method: 'GET',
  path: creditsConstants.routes.CREDITS_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: creditsConstants.routes.CREDITS_UPLOAD_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      parse: false,
      multipart: true,
      timeout: false,
      allow: 'multipart/form-data',
      failAction: (_request, h, err) => {
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
    h,
    href: UPLOAD_CREDIT_METRIC_ID,
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: creditsConstants.views.CREDITS_UPLOAD_METRIC
  })
}
