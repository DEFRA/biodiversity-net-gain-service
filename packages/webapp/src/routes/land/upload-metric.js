import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    const validationError = getValidation(result[0].metricData.validation)
    if (validationError) {
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
      title: 'Upload Biodiversity Metric'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_METRIC
    })
    return h.view(constants.views.UPLOAD_METRIC)
  },
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
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

const buildConfig = sessionId => {
  const config = {}
  buildBlobConfig(sessionId, config)
  buildQueueConfig(config)
  buildFunctionConfig(config)
  buildSignalRConfig(sessionId, config)
  buildFileValidationConfig(config)
  return config
}

const buildBlobConfig = (sessionId, config) => {
  config.blobConfig = {
    blobName: `${sessionId}/${constants.uploadTypes.METRIC_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.METRIC_UPLOAD_TYPE,
    queueName: 'untrusted-file-queue'
  }
}

const buildFunctionConfig = config => {
  config.functionConfig = {
    uploadFunction: uploadStreamAndQueueMessage,
    handleEventsFunction: handleEvents
  }
}

const buildSignalRConfig = (sessionId, config) => {
  config.signalRConfig = {
    eventProcessingFunction: null,
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.metricFileExt
  }
}

const getValidation = metricValidation => {
  const error = {
    err: [
      {
        text: '',
        href: UPLOAD_METRIC_ID
      }
    ]
  }
  if (!metricValidation.isVersion4OrLater) {
    error.err[0].text = 'The selected file must use Biodiversity Metric version 4.0'
  } else if (!metricValidation.isOffsiteDataPresent) {
    error.err[0].text = 'The selected file does not have enough data'
  } else if (!metricValidation.areOffsiteTotalsCorrect) {
    error.err[0].text = 'The selected file has an error - the baseline total area does not match the created and enhanced total area for the off-site'
  }
  return error.err[0].text ? error : null
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
          return h.view(constants.views.UPLOAD_METRIC, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`,
                href: UPLOAD_METRIC_ID
              }
            ]
          }).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]
