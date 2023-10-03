import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

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
    const config = buildConfig({
      sessionId: request.yar.id,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024,
      fileExt: constants.managementPlanFileExt,
      uploadType: constants.uploadTypes.MANAGEMENT_PLAN_UPLOAD_TYPE
    })
    try {
      const result = await uploadFile(logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.log(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
  }
}

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.MANAGEMENT_PLAN_FILE_TYPE, result.fileType)
  logger.log(`${new Date().toUTCString()} Received management plan data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_MANAGEMENT_PLAN)
}

const processErrorUpload = (err, h) => {
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
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumManagementPlanFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
          err: [{
            text: 'File malware scan failed',
            href: MANAGEMENT_PLAN_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
          err: [{
            text: 'File malware detected',
            href: MANAGEMENT_PLAN_ID
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_MANAGEMENT_PLAN, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: MANAGEMENT_PLAN_ID
          }]
        })
      }
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
        logger.log(`${new Date().toUTCString()} File upload too large ${request.path}`)
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumManagementPlanFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumManagementPlanFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: MANAGEMENT_PLAN_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.UPLOAD_MANAGEMENT_PLAN
  })
}
