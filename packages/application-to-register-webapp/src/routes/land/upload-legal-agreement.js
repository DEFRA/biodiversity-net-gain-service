import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'

const LEGAL_AGREEMENT_ID = '#legalAgreement'
const handlers = {
  get: async (_request, h) => h.view(constants.views.UPLOAD_LEGAL_AGREEMENT),
  post: async (request, h) => {
    const config = buildConfig(request.yar.id)
    return await uploadFiles(logger, request, config).then(
      function (result) {
        if ((parseFloat(result.fileSize) * 100) === 0) {
          return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
            err: [{
              text: 'The selected file is empty',
              href: LEGAL_AGREEMENT_ID
            }]
          })
        } else if (result[0].errorMessage === undefined) {
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, result[0].location)
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE, result.fileSize)
          logger.log(`${new Date().toUTCString()} Received legal agreement data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
          request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_MAP_CONFIG, result.mapConfig)

          return h.redirect(constants.routes.CHECK_LEGAL_AGREEMENT)
        }

        return h.redirect(constants.views.INTERNAL_SERVER_ERROR)
      },
      function (err) {
        switch (err.message) {
          case constants.uploadErrors.noFile:
            return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
              err: [{
                text: 'Select a legal agreement',
                href: LEGAL_AGREEMENT_ID
              }]
            })
          case constants.uploadErrors.unsupportedFileExt:
            return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
              err: [{
                text: 'The selected file must be a DOC, DOCX or PDF',
                href: LEGAL_AGREEMENT_ID
              }]
            })
          default:
            if (err.message.indexOf('timed out') > 0) {
              return h.redirect(constants.views.UPLOAD_LEGAL_AGREEMENT, {
                err: [{
                  text: 'The selected file could not be uploaded -- try again',
                  href: LEGAL_AGREEMENT_ID
                }]
              })
            }
            throw err
        }
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: LEGAL_AGREEMENT_ID
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
    timeout: parseInt(process.env.UPLOAD_PROCESSING_TIMEOUT_MILLIS) || 180000,
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
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        console.log('File upload too large', request.path)
        if (err.output.statusCode === 413) { // Request entity too large
          return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
            err: [
              {
                text: 'The selected file must not be larger than 50MB',
                href: LEGAL_AGREEMENT_ID
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
