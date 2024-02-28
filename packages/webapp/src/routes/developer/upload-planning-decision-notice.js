import { logger } from '@defra/bng-utils-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const PLANNING_DECISION_NOTICE_ID = '#planningDecisionNotice'

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, result.fileType)
  logger.info(`${new Date().toUTCString()} Received planning decision data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE, {
        err: [{
          text: 'The selected file is empty',
          href: PLANNING_DECISION_NOTICE_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE, {
        err: [{
          text: 'Select the Planning decision notice file',
          href: PLANNING_DECISION_NOTICE_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumSizeExceeded(h)
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: PLANNING_DECISION_NOTICE_ID
        }]
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: PLANNING_DECISION_NOTICE_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.DEVELOPER_.UPLOAD_PLANNING_DECISION_NOTICE, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: PLANNING_DECISION_NOTICE_ID
          }]
        })
      } else {
        return h.view(constants.views.DEVELOPER_.UPLOAD_PLANNING_DECISION_NOTICE, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: PLANNING_DECISION_NOTICE_ID
          }]
        })
      }
  }
}

const maximumSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: PLANNING_DECISION_NOTICE_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE
  })
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE
    })

    return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_PLANNING_DECISION_NOTICE_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    try {
      const result = await uploadFile(logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
  }
}

const failAction = (request, h, err) => {
  logger.error(`${new Date().toUTCString()} File upload too large ${request.path}`)
  if (err.output.statusCode === 413) { // Request entity too large
    return maximumSizeExceeded(h).takeover()
  } else {
    throw err
  }
}

const payload = {
  maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
  multipart: true,
  timeout: false,
  output: 'stream',
  parse: false,
  allow: 'multipart/form-data',
  failAction
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  handler: handlers.post,
  options: {
    payload
  }
}]
