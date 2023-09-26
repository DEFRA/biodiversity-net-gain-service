import { logger } from 'defra-logging-facade'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, getMetricFileValidationErrors, processRegistrationTask } from '../../utils/helpers.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

async function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    const validationError = getMetricFileValidationErrors(result[0].metricData?.validation)
    if (validationError) {
      await deleteBlobFromContainers(result[0].location)
      return h.view(constants.views.UPLOAD_METRIC, validationError)
    }
    request.yar.set(constants.redisKeys.METRIC_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.METRIC_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.METRIC_FILE_TYPE, result.fileType)
    request.yar.set(constants.redisKeys.METRIC_DATA, result[0].metricData)
    logger.log(`${new Date().toUTCString()} Received metric data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_UPLOAD_METRIC
  }
  return h.redirect(resultView)
}

function processErrorUpload (err, h) {
  switch (err.message) {
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
          text: 'Select a Biodiversity Metric',
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
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_METRIC, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: UPLOAD_METRIC_ID
          }]
        })
      }
      throw err
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
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
      maxFileSize: parseInt(process.env.MAX_METRIC_UPLOAD_MB) * 1024 * 1024
    })
    return uploadFiles(logger, request, config).then(
      function (result) {
        return processSuccessfulUpload(result, request, h)
      },
      function (err) {
        return processErrorUpload(err, h)
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.UPLOAD_METRIC, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: UPLOAD_METRIC_ID
        }]
      })
    })
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
        console.log('File upload too large', request.path)
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
