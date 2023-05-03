import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import { ThreatScreeningError, UploadTypeValidationError } from '@defra/bng-errors-lib'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const invalidUploadErrorText = 'The selected file must be an DOC, DOCX or PDF'
const DEVELOPER_WRITTEN_CONSENT_ID = '#uploadWrittenConsent'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD),
  post: async (request, h) => performUpload(request, h)
}

const performUpload = async (request, h) => {
  const config = buildConfig(request.yar.id)

  try {
    const writtenConsentFile = await uploadFiles(logger, request, config)
    if (writtenConsentFile) {
      const uploadedFileLocation = `${writtenConsentFile[0].location.substring(0, writtenConsentFile[0].location.lastIndexOf('/'))}/${writtenConsentFile.filename}`
      if (writtenConsentFile[0].location !== uploadedFileLocation) {
        request.yar.set(constants.redisKeys.DEVELOPER_ORIGINAL_CONSENT_LOCATION, uploadedFileLocation)
      }
      request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, writtenConsentFile[0].location)
      request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME, writtenConsentFile.filename)
      request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, parseFloat(writtenConsentFile.fileSize).toFixed(2))
      request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, writtenConsentFile.fileType)
    }

    return h.redirect(constants.routes.DEVELOPER_AGREEMENT_CHECK)
  } catch (err) {
    const errorContext = getErrorContext(err)
    return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, errorContext)
  }
}

const getErrorContext = err => {
  const error = {}
  if (err instanceof ThreatScreeningError) {
    const status = err.threatScreeningDetails.Status
    error.err = [{
      text: status === constants.threatScreeningStatusValues.QUARANTINED ? constants.uploadErrors.threatDetected : constants.uploadErrors.uploadFailure,
      href: DEVELOPER_WRITTEN_CONSENT_ID
    }]
  } else if (err instanceof UploadTypeValidationError || err.message === constants.uploadErrors.unsupportedFileExt) {
    error.err = [{
      text: invalidUploadErrorText,
      href: DEVELOPER_WRITTEN_CONSENT_ID
    }]
  } else {
    processErrorMessage(err.message, error)
  }

  if (error.err) {
    // Prepare to redisplay the upload developer consent view with the configured error.
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
        text: 'Select a written consent',
        href: DEVELOPER_WRITTEN_CONSENT_ID
      }]
      break
    case constants.uploadErrors.emptyFile:
      error.err = [{
        text: 'The selected file is empty',
        href: DEVELOPER_WRITTEN_CONSENT_ID
      }]
      break
    default:
      if (errorMessage.indexOf('timed out') > 0) {
        error.err = [{
          text: constants.uploadErrors.uploadFailure,
          href: DEVELOPER_WRITTEN_CONSENT_ID
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
    blobName: `${sessionId}/${constants.uploadTypes.DEVELOPER_CONSENT_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.DEVELOPER_CONSENT_UPLOAD_TYPE,
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
    fileExt: constants.consentFileExt
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_CONSENT_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (req, h, error) => {
        logger.log(`${new Date().toUTCString()} Uploaded file is too large ${req.path}`)
        if (error.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_CONSENT_UPLOAD_MB}MB`,
                href: DEVELOPER_WRITTEN_CONSENT_ID
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
