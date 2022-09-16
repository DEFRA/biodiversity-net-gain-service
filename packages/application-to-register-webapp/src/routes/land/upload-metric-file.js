import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const UPLOAD_METRIC_ID = '#uploadMetric'

function processSuccessfulUpload (result, request) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  let errorMessage = {}
  if ((parseFloat(result.fileSize) * 100) === 0) {
    resultView = constants.views.UPLOAD_METRIC
    errorMessage = {
      err: [{
        text: 'The selected file is empty',
        href: UPLOAD_METRIC_ID
      }]
    }
  } else if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.METRIC_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.METRIC_FILE_SIZE, result.fileSize)
    logger.log(`${new Date().toUTCString()} Received land boundary data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_UPLOAD_METRIC
  }
  return { resultView, errorMessage }
}

function processErrorUpload (err, h) {
  switch (err.message) {
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

function processReturnValue (details, h) {
  return details.resultView === constants.routes.CHECK_UPLOAD_METRIC
    ? h.redirect(details.resultView, details.errorMessage)
    : h.view(details.resultView, details.errorMessage)
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_METRIC),
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    return uploadFiles(logger, request, config).then(
      function (result) {
        const viewDetails = processSuccessfulUpload(result, request)
        return processReturnValue(viewDetails, h)
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
    blobName: `${sessionId}/uploadMetric/`,
    containerName: 'untrusted',
    metadata: {
      noprocess: 'true' // metadata to stop file being sent on for post processing
    }
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
                text: 'The selected file must not be larger than 50MB',
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
