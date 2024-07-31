import { logger } from '@defra/bng-utils-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { maximumSizeExceeded, handleFileUploadOperation } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const PLANNING_DECISION_NOTICE_ID = '#planningDecisionNotice'

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, result.fileType)
  logger.info(`${new Date().toUTCString()} Received planning decision data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return getNextStep(request, h)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE, {
    err: [{
      text: message,
      href: PLANNING_DECISION_NOTICE_ID
    }]
  })
}
function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a planning decision notice file')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumSizeExceeded(h, {
        href: PLANNING_DECISION_NOTICE_ID,
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
        view: constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected)
      } else {
        return buildErrorResponse(h, constants.uploadErrors.uploadFailure)
      }
  }
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE),
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_PLANNING_DECISION_NOTICE_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    const uploadOperation = () => uploadFile(logger, request, config)
    return handleFileUploadOperation(uploadOperation, {
      logger,
      request,
      h,
      onSuccess: processSuccessfulUpload,
      onError: processErrorUpload
    })
  }
}

const failAction = (request, h, err) => {
  logger.error(`${new Date().toUTCString()} File upload too large ${request.path}`)
  if (err.output.statusCode === 413) { // Request entity too large
    return maximumSizeExceeded(h, {
      href: PLANNING_DECISION_NOTICE_ID, // Ensure this ID is correct for your context
      maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      view: constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE
    }).takeover()
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
