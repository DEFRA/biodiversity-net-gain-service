import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/credits-purchase-constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMetricFileValidationErrors } from '../../utils/helpers.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const UPLOAD_CREDIT_METRIC_ID = '#uploadMetric'
const backLink = constants.routes.CREDITS_PURCHASE_TASK_LIST

const processSuccessfulUpload = async (result, request, h) => {
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_CREDIT_METRIC_ID, false)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.redirectView(constants.views.CREDITS_PURCHASE_UPLOAD_METRIC, {
      ...validationError,
      backLink
    })
  }

  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_DATA, result.postProcess.metricData)
  request.yar.set(constants.redisKeys.CREDITS_PURCHASE_METRIC_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received metric data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirectView(constants.routes.CREDITS_PURCHASE_CHECK_UPLOAD_METRIC)
}

const handlers = {
  get: async (request, h) => h.view(constants.views.CREDITS_PURCHASE_UPLOAD_METRIC, { backLink }),
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
      request.logger.info(`${new Date().toUTCString()} Problem uploading credits metric file ${err}`)
      return processErrorUpload({
        err,
        h,
        route: constants.views.CREDITS_PURCHASE_UPLOAD_METRIC,
        elementID: UPLOAD_CREDIT_METRIC_ID,
        noFileErrorMessage: 'Select a statutory biodiversity metric',
        unsupportedFileExtErrorMessage: 'The selected file must be an XLSM or XLSX',
        maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB
        // backlink?
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  handler: addRedirectViewUsed(handlers.get)
},
{
  method: 'POST',
  path: constants.routes.CREDITS_PURCHASE_UPLOAD_METRIC,
  handler: addRedirectViewUsed(handlers.post),
  options:
    generatePayloadOptions(
      UPLOAD_CREDIT_METRIC_ID,
      process.env.MAX_METRIC_UPLOAD_MB,
      constants.views.CREDITS_PURCHASE_UPLOAD_METRIC
      // backLink
    )
}]
