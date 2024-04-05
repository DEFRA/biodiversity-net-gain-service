import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { getMetricFileValidationErrors, processRegistrationTask } from '../../utils/helpers.js'
import { MalwareDetectedError, ThreatScreeningError } from '@defra/bng-errors-lib'

const uploadMetricId = '#uploadMetric'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.METRIC_LOCATION, true))
  const validationError = getMetricFileValidationErrors(result.postProcess.metricData?.validation, uploadMetricId, true)
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

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_METRIC, {
    err: [{
      text: message,
      href: uploadMetricId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.notValidMetric:
      return buildErrorResponse(h, 'The selected file is not a valid Metric')
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a statutory biodiversity metric')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be an XLSM or XLSX')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, uploadMetricId, process.env.MAX_METRIC_UPLOAD_MB, constants.views.UPLOAD_METRIC)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected)
      } else {
        return buildErrorResponse(h, constants.uploadErrors.uploadFailure)
      }
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add habitat baseline, creation and enhancements'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_METRIC
    })
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
      return processErrorUpload(err, h)
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
  options: generatePayloadOptions(uploadMetricId, process.env.MAX_METRIC_UPLOAD_MB, constants.views.UPLOAD_METRIC)
}
]
