import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { getReferrer, setReferrer } from '../../utils/helpers.js'

const LAND_OWNERSHIP_ID = '#landOwnership'

function processSuccessfulUpload (result, request) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  let errorMessage = {}
  if ((parseFloat(result.fileSize) * 100) === 0) {
    resultView = constants.views.UPLOAD_LAND_OWNERSHIP
    errorMessage = {
      err: [{
        text: 'The selected file is empty',
        href: LAND_OWNERSHIP_ID
      }]
    }
  } else if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, result.fileSize)
    logger.log(`${new Date().toUTCString()} Received land ownership data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    const referredFrom = getReferrer(request, constants.redisKeys.LAND_OWNERSHIP_KEY, true)
    if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
      resultView = constants.routes.CHECK_OWNERSHIP_DETAILS
    } else {
      resultView = constants.routes.CHECK_PROOF_OF_OWNERSHIP
    }
  }
  return { resultView, errorMessage }
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'Select a proof of land ownership file',
          href: LAND_OWNERSHIP_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: LAND_OWNERSHIP_ID
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_LAND_OWNERSHIP, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: LAND_OWNERSHIP_ID
          }]
        })
      }
      throw err
  }
}

function processReturnValue (details, h) {
  return details.resultView === constants.routes.CHECK_PROOF_OF_OWNERSHIP || details.resultView === constants.routes.CHECK_OWNERSHIP_DETAILS
    ? h.redirect(details.resultView, details.errorMessage)
    : h.view(details.resultView, details.errorMessage)
}

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.LAND_OWNERSHIP_KEY)
    return h.view(constants.views.UPLOAD_LAND_OWNERSHIP)
  },
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
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: LAND_OWNERSHIP_ID
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
    blobName: `${sessionId}/${constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
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
    fileExt: constants.lanOwnerFileExt
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('File upload too large', request.path)
        if (err.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
            err: [
              {
                text: 'The selected file must not be larger than 50MB',
                href: LAND_OWNERSHIP_ID
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
