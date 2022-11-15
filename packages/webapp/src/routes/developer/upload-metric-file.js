import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import { ThreatScreeningError, UploadTypeValidationError } from '@defra/bng-errors-lib'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const invalidUploadErrorText = 'The selected file must be an XLSM or XLSX'
const DEVELOPER_UPLOAD_METRIC_ID = '#uploadMetric'

<<<<<<< HEAD
const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => performUpload(request, h)
}

const performUpload = async (request, h) => {
  const config = buildConfig(request.yar.id)

  try {
    const metricFileData = await uploadFiles(logger, request, config)
    const uploadedFileLocation = `${metricFileData[0].location.substring(0, metricFileData[0].location.lastIndexOf('/'))}/${metricFileData.filename}`
    if (metricFileData[0].location !== uploadedFileLocation) {
      request.yar.set(constants.redisKeys.DEVELOPER_ORIGINAL_METRIC_UPLOAD_LOCATION, uploadedFileLocation)
    }
    request.yar.set(constants.redisKeys.DEVELOPER_METRIC_LOCATION, metricFileData[0].location)
    request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME, metricFileData.filename)
    request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE, parseFloat(metricFileData.fileSize).toFixed(4))
    request.yar.set(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE, metricFileData.fileType)

    return h.redirect(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, errorContext)
=======
function processSuccessfulUpload (res, req) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  let errorMessage = {}
  if ((parseFloat(res.fileSize) * 100) === 0) {
    resultView = constants.views.DEVELOPER_UPLOAD_METRIC
    errorMessage = {
      err: [{
        text: 'The selected file is empty',
        href: DEVELOPER_UPLOAD_METRIC_ID
      }]
    }
  } else if (res[0].errorMessage === undefined) {
    req.yar.set(constants.redisKeys.METRIC_LOCATION, res[0].location)
    req.yar.set(constants.redisKeys.METRIC_FILE_SIZE, res.fileSize)
    req.yar.set(constants.redisKeys.METRIC_FILE_TYPE, res.fileType)
    logger.log(`${new Date().toUTCString()} Received land boundary data for ${res[0].location.substring(res[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
  }
  return { resultView, errorMessage }
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'Select a Biodiversity Metric',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file must be an XLSM or XLSX',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.DEVELOPER_UPLOAD_METRIC, {
          err: [{
            text: 'The selected file could not be uploaded – try again',
            href: DEVELOPER_UPLOAD_METRIC_ID
          }]
        })
      }
      throw err
  }
}

function processReturnValue (details, h) {
  return details.resultView === constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
    ? h.redirect(details.resultView, details.errorMessage)
    : h.view(details.resultView, details.errorMessage)
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_METRIC),
  post: async (request, h) => {
    const config = developerBuildConfig(request.yar.id)
    return uploadFiles(logger, request, config).then(
      async function (result) {
        const viewDetails = processSuccessfulUpload(result, request)
        return processReturnValue(viewDetails, h)
      },
      function (err) {
        return processErrorUpload(err, h)
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.DEVELOPER_UPLOAD_METRIC, {
        err: [{
          text: 'The selected file could not be uploaded – try again',
          href: DEVELOPER_UPLOAD_METRIC_ID
        }]
      })
    })
>>>>>>> 7f740a4 (updated error message as per copy deck content)
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
    blobName: `${sessionId}/${constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.DEVELOPER_METRIC_UPLOAD_TYPE,
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
