import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_LEGAL_AGREEMENT),
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    return await uploadFiles(logger, request, config).then(
      function (result) {
        if ((parseFloat(result.fileSize) * 100) === 0) {
          result[0].errorMessage = 'The selected file is empty'
        } else if (result[0].errorMessage === undefined) {
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, result[0].location)
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE, result.fileSize)
          logger.log(`${new Date().toUTCString()} Received legal agreement data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_MAP_CONFIG, result.mapConfig)

          return h.redirect(constants.routes.CHECK_LEGAL_AGREEMENT)
        }

        return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
          err: [{
            text: result[0].errorMessage,
            href: '#legalAgreement'
          }]
        })
      },
      function (err) {
        switch (err.message) {
          case constants.uploadErrors.noFile:
            return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
              err: [{
                text: 'Select a legal agreement',
                href: '#legalAgreement'
              }]
            })
          case constants.uploadErrors.unsupportedFileExt:
            return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
              err: [{
                text: 'The selected file must be a DOC, DOCX or PDF',
                href: '#legalAgreement'
              }]
            })
          default:
            if (err.message.indexOf('timed out') > 0) {
              return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
                err: [{
                  text: 'The selected file could not be uploaded -- try again',
                  href: '#legalAgreement'
                }]
              })
            }
            throw err
        }
      }
    )
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
    blobName: `${sessionId}/legalAgreement/`,
    containerName: 'untrusted',
    metadata: {
      noprocess: 'true' // metadata to stop file being sent on for post processing
    }
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.LEGAL_AGREEMENT_UPLOAD_TYPE,
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
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 30000,
    url: `${process.env.SIGNALR_URL}?userId=${sessionId}`
  }
}

const buildFileValidationConfig = (config) => {
  config.fileValidationConfig = {
    fileExt: constants.legalAgreementFileExt
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LEGAL_AGREEMENT,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LEGAL_AGREEMENT,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      output: 'stream',
      parse: false,
      failAction: (request, h, err) => {
        if (err.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
            err: [
              {
                text: 'The selected file must be smaller than 50MB',
                href: '#legalAgreement'
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
