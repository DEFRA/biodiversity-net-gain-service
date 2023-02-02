import { logger } from 'defra-logging-facade'
import { handleEvents } from '../../utils/azure-signalr.js'
import { uploadStreamAndQueueMessage } from '../../utils/azure-storage.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const MANAGEMENT_PLAN_ID = '#managementPlan'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat management and monitoring details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_MANAGEMENT_PLAN
    })
    return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN)
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
      return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: MANAGEMENT_PLAN_ID
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
    blobName: `${sessionId}/${constants.uploadTypes.MANAGEMENT_PLAN_UPLOAD_TYPE}/`,
    containerName: 'untrusted'
  }
}

const buildQueueConfig = config => {
  config.queueConfig = {
    uploadType: constants.uploadTypes.MANAGEMENT_PLAN_UPLOAD_TYPE,
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

const buildFileValidationConfig = config => {
  config.fileValidationConfig = {
    fileExt: constants.managementPlanFileExt
  }
}

function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE, result.fileType)
    logger.log(`${new Date().toUTCString()} Received management plan data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_MANAGEMENT_PLAN
  }
  return h.redirect(resultView)
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
        err: [{
          text: 'The selected file is empty',
          href: MANAGEMENT_PLAN_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
        err: [{
          text: 'Select a habitat management and monitoring plan',
          href: MANAGEMENT_PLAN_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: MANAGEMENT_PLAN_ID
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_MANAGEMENT_PLAN, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: MANAGEMENT_PLAN_ID
          }]
        })
      }
      throw err
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_MANAGEMENT_PLAN,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_MANAGEMENT_PLAN,
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
          return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
            err: [
              {
                text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`,
                href: MANAGEMENT_PLAN_ID
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
