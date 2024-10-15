import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { getMetricFileValidationErrors } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.METRIC_LOCATION, true))

  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, UPLOAD_METRIC_ID, true)

  if (validationError) {
    await deleteBlobFromContainers(result.config.blobConfig.blobName)
    return h.view(constants.views.UPLOAD_METRIC, validationError)
  }

  // force replay of developer metric upload and habitat matching if user uploads a new registration metric
  // clear developer metric data
  request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
  request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE)
  request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE)
  request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_DATA)
  request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME)

  // Clear any previously matched combined case habitats as they're no longer valid after uploading a new file
  const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
  if (isCombinedCase) {
    request.yar.clear(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    request.yar.clear(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)
  }

  // set new metric data
  request.yar.set(constants.redisKeys.METRIC_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.METRIC_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.METRIC_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.METRIC_DATA, result.postProcess.metricData)
  return getNextStep(request, h)
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
      fileType: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
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
        route: constants.views.UPLOAD_METRIC,
        elementID: UPLOAD_METRIC_ID,
        noFileErrorMessage: 'Select a statutory biodiversity metric',
        unsupportedFileExtErrorMessage: 'The selected file must be an XLSM or XLSX',
        invalidFileTypeErrorMessage: 'The selected file must be a valid XLSM or XLSX',
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
