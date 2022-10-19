import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import {getReferrer, setReferrer} from '../../utils/helpers.js'

function processSuccessfulUpload (result, request, legaAgreementId) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  let errorMessage = {}
  if ((parseFloat(result.fileSize) * 100) === 0) {
    resultView = constants.views.UPLOAD_LEGAL_AGREEMENT
    errorMessage = {
      err: [{
        text: 'The selected file is empty',
        href: legaAgreementId
      }]
    }
  } else if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_TYPE, result.fileType)
    logger.log(`${new Date().toUTCString()} Received legal agreement data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_LEGAL_AGREEMENT
  }
  return { resultView, errorMessage }
}

function processErrorUpload (err, h, legaAgreementId) {
  switch (err.message) {
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        err: [{
          text: 'Select a legal agreement',
          href: legaAgreementId
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: legaAgreementId
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_LEGAL_AGREEMENT, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: legaAgreementId
          }]
        })
      }
      throw err
  }
}

function processReturnValue (details, h) {
  return details.resultView === constants.routes.CHECK_LEGAL_AGREEMENT
    ? h.redirect(details.resultView, details.errorMessage)
    : h.view(details.resultView, details.errorMessage)
}

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
    return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    const legaAgreementId = '#legalAgreement'
    const config = buildConfig(request.yar.id)

    return uploadFiles(logger, request, config).then(
      function (result) {
        const viewDetails = processSuccessfulUpload(result, request, legaAgreementId)
        const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY, true)
        if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
          return h.redirect(`/${constants.views.LEGAL_AGREEMENT_SUMMARY}`)
        }
        return processReturnValue(viewDetails, h)
      },
      function (err) {
        return processErrorUpload(err, h, legaAgreementId)
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: legaAgreementId
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
    blobName: `${sessionId}/${constants.uploadTypes.LEGAL_AGREEMENT_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
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

const buildFileValidationConfig = config => {
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
