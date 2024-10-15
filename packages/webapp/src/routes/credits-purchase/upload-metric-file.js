import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/credits-purchase-constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMetricFileValidationErrors, getMaximumFileSizeExceededView } from '../../utils/helpers.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'

const processErrorUpload = (err, request, h) => {
  const errorMessages = {
    [constants.uploadErrors.notValidMetric]: 'The selected file is not a valid Metric',
    [constants.uploadErrors.emptyFile]: 'The selected file is empty',
    [constants.uploadErrors.noFile]: 'Select a statutory biodiversity metric',
    [constants.uploadErrors.unsupportedFileExt]: 'The selected file must be an XLSM or XLSX',
    [constants.uploadErrors.maximumFileSizeExceeded]: maximumFileSizeExceeded
  }

  let errorDetails

  if (err instanceof ThreatScreeningError) {
    errorDetails = {
      err: [{
        text: constants.uploadErrors.malwareScanFailed,
        href: UPLOAD_CREDIT_METRIC_ID
      }]
    }
  } else if (err instanceof MalwareDetectedError) {
    errorDetails = {
      err: [{
        text: constants.uploadErrors.threatDetected,
        href: UPLOAD_CREDIT_METRIC_ID
      }]
    }
  } else {
    errorDetails = {
      err: [{
        text: errorMessages[err.message] || constants.uploadErrors.uploadFailure,
        href: UPLOAD_CREDIT_METRIC_ID
      }]
    }
  }

  request.yar.set('errors', errorDetails.err)

  return h.redirect(constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
}

const maximumFileSizeExceeded = (h, view) => {
  return getMaximumFileSizeExceededView({
    h,
    href: UPLOAD_CREDIT_METRIC_ID,
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view
  })
}

const processSuccessfulUpload = async (result, request, h) => {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_CREDIT_METRIC_ID, false)

  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    request.yar.set('errors', validationError.err)
    return h.redirect(constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC)
  }

  const blobName = result.config.blobConfig.blobName
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, blobName)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_NAME, result.filename)

  request.logger.info(`${new Date().toUTCString()} Received metric data for ${blobName.split('/').pop()}`)
  return h.redirect(constants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
}

const handlers = {
  get: async (request, h) => {
    const errors = request.yar.get('errors') || null
    request.yar.clear('errors')

    return h.view(constants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
      backLink: constants.routes.CREDITS_PURCHASE_TASK_LIST,
      err: errors
    })
  },
  post: async (request, h) => {
    const uploadConfig = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.CREDITS_PURCHASE_METRIC_UPLOAD_TYPE,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      postProcess: true
    })

    try {
      const result = await uploadFile(request.logger, request, uploadConfig)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.info(`${new Date().toUTCString()} Problem uploading credits metric file: ${err}`)
      return processErrorUpload(err, request, h)
    }
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
    handler: handlers.post,
    options: generatePayloadOptions(UPLOAD_CREDIT_METRIC_ID, process.env.MAX_METRIC_UPLOAD_MB, constants.views.CREDITS_PURCHASE_UPLOAD_METRIC)
  }
]
