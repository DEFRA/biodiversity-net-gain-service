import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { getMetricFileValidationErrors } from '../../utils/helpers.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.METRIC_LOCATION, true))
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_METRIC_ID, true)
  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.UPLOAD_METRIC, validationError)
  }
  request.yar.set(constants.redisKeys.METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.METRIC_DATA, result.postProcess.metricData)
  return h.redirect(constants.routes.CHECK_UPLOAD_METRIC)
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_METRIC)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.METRIC_UPLOAD_TYPE,
      fileExt: constants.metricFileExt,
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024,
      postProcess: true
    })
    try {
      const result = await uploadFile(request.logger, request, config)
      return await processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload({
        err,
        h,
        href: constants.views.UPLOAD_METRIC,
        elementID: UPLOAD_METRIC_ID,
        noFileErrorMessage: 'Select a statutory biodiversity metric',
        unsupportedFileExtErrorMessage: 'The selected file must be an XLSM or XLSX',
        maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_METRIC,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      UPLOAD_METRIC_ID,
      process.env.MAX_METRIC_UPLOAD_MB,
      constants.views.UPLOAD_METRIC
    )
}]
