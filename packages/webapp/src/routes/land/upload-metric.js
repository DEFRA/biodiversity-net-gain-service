import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors, processRegistrationTask } from '../../utils/helpers.js'
import { MalwareDetectedError, ThreatScreeningError } from '@defra/bng-errors-lib'

const UPLOAD_METRIC_ID = '#uploadMetric'

const processSuccessfulUpload = async (result, request, h) => {
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

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.notValidMetric:
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is not a valid Metric',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'The selected file is empty',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'Select a statutory biodiversity metric',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: UPLOAD_METRIC_ID
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_METRIC, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: UPLOAD_METRIC_ID
          }]
        })
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
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        request.logger.info(`${new Date().toUTCString()} File upload too large ${request.path}`)
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
    href: UPLOAD_METRIC_ID,
    maximumFileSize: process.env.MAX_METRIC_UPLOAD_MB,
    view: constants.views.UPLOAD_METRIC
  })
}
