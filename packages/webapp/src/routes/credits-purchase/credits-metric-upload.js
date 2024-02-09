import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import constants from '../../utils/constants.js'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'

const processSuccessfulCreditUpload = async (result, request, h) => {
  const creditsValidationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation)
  if (creditsValidationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.CREDITS_UPLOAD_METRIC, creditsValidationError)
  }

  request.yar.set(constants.redisKeys.CREDITS_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.CREDITS_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.CREDITS_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.CREDITS_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.CREDITS_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CREDITS_CHECK_UPLOAD_METRIC)
}

const processCreditsErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'Select a Biodiversity Metric',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_CREDIT_METRIC_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      } else {
        return h.view(constants.views.CREDITS_UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: UPLOAD_CREDIT_METRIC_ID
          }]
        })
      }
  }
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.CREDITS_UPLOAD_METRIC),
  post: async (request, h) => {
    // Get upload config object from common code
    const creditsUploadConfig = buildConfig({
      sessionId: request.yar.id,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      uploadType: constants.uploadTypes.CREDITS_METRIC_UPLOAD_TYPE,
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
  path: constants.routes.CREDITS_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.CREDITS_UPLOAD_METRIC,
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
    view: constants.views.CREDITS_UPLOAD_METRIC,
    href: UPLOAD_CREDIT_METRIC_ID,
    h
  })
}
