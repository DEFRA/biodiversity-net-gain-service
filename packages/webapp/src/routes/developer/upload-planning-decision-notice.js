import { logger } from '@defra/bng-utils-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'

const DEVELOPER_PLANNING_DECISION_NOTICE_ID = '#planningDecisionNotice'

async function processSuccessfulUpload (result, request, h) {
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_PLANNING_DECISION_NOTICE_FILE_TYPE, result.fileType)
  logger.info(`${new Date().toUTCString()} Received planning decision data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_PLANNING_DECISION_NOTICE_FILE)
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
    try {
      const result = await uploadFile(request.lologger, request, config)
      return await processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload({
        err,
        h,
        href: constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
        elementID: DEVELOPER_PLANNING_DECISION_NOTICE_ID,
        noFileErrorMessage: 'Select and upload a planning decision notice file',
        unsupportedFileExtErrorMessage: 'The selected file must be a DOC, DOCX or PDF',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      DEVELOPER_PLANNING_DECISION_NOTICE_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.DEVELOPER_UPLOAD_PLANNING_DECISION_NOTICE
    )
}]
