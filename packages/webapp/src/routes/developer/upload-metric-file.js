import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import { ThreatScreeningError, UploadTypeValidationError } from '@defra/bng-errors-lib'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const invalidUploadErrorText = 'The selected file must be an XLSM or XLSX'
const DEVELOPER_UPLOAD_METRIC_ID = '#uploadMetric'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => performUpload(request, h)
}

const performUpload = async (request, h) => {
  const config = buildConfig(request.yar.id)

  try {
    const metricFileData = await uploadFiles(logger, request, config)
    if (metricFileData) {
      const uploadedFileLocation = `${metricFileData[0].location.substring(0, metricFileData[0].location.lastIndexOf('/'))}/${metricFileData.filename}`
      if (metricFileData[0].location !== uploadedFileLocation) {
        request.yar.set(constants.redisKeys.DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION, uploadedFileLocation)
      }
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_DATA, metricFileData[0].metricData)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, metricFileData[0].location)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, metricFileData.filename)
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, parseFloat(metricFileData.fileSize).toFixed(1))
      request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, metricFileData.fileType)
    }

    return h.redirect(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, errorContext)
  }
}

const getErrorContext = err => {
  const error = {}
  if (err instanceof ThreatScreeningError) {
    const status = err.threatScreeningDetails.Status
    error.err = [{
      text: status === constants.threatScreeningStatusValues.QUARANTINED ? constants.uploadErrors.threatDetected : constants.uploadErrors.uploadFailure,
      href: DEVELOPER_UPLOAD_METRIC_ID
    }]
  } else if (err instanceof UploadTypeValidationError || err.message === constants.uploadErrors.unsupportedFileExt) {
    error.err = [{
      text: invalidUploadErrorText,
      href: DEVELOPER_UPLOAD_METRIC_ID
    }]
  } else {
    processErrorMessage(err.message, error)
  }

  if (error.err) {
    // Prepare to redisplay the upload developer metric view with the configured error.
    return error
  } else {
    // An unexpected error has occurred. Rethrow it so that the default error page is returned.
    throw err
  }
}

const processErrorMessage = (errorMessage, error) => {
  switch (errorMessage) {
    case constants.uploadErrors.noFile:
      error.err = [{
        text: 'Select a Biodiversity Metric',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
      break
    case constants.uploadErrors.emptyFile:
      error.err = [{
        text: 'The selected file is empty',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
      break
    default:
      if (errorMessage.indexOf('timed out') > 0) {
        error.err = [{
          text: constants.uploadErrors.uploadFailure,
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      }
      break
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

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_METRIC,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_METRIC_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (req, h, error) => {
        logger.log(`${new Date().toUTCString()} Uploaded file is too large ${req.path}`)
        if (error.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_METRIC_UPLOAD_MB}MB`,
                href: DEVELOPER_UPLOAD_METRIC_ID
              }
            ]
          }).takeover()
        } else {
          throw error
        }
      }
    }
  }
}]
