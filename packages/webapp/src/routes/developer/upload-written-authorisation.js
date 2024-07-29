import { logger } from '@defra/bng-utils-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import getDeveloperClientContext from '../../utils/get-developer-client-context.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { isAgentAndNotLandowner } from '../../utils/helpers.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const DEVELOPER_WRITTEN_AUTHORISATION_ID = '#writtenAuthorisation'

async function processSuccessfulUpload (result, request, h) {
  request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_NAME, result.filename)
  logger.info(`${new Date().toUTCString()} Received written authorisation data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE)
}

const handlers = {
  get: async (request, h) => {
    const context = getDeveloperClientContext(request.yar)
    context[constants.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED] = isAgentAndNotLandowner(request.yar)

    return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, context)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    try {
      const result = await uploadFile(logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload({
        err,
        h,
        route: constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
        elementID: DEVELOPER_WRITTEN_AUTHORISATION_ID,
        noFileErrorMessage: 'Select the written authorisation file',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  handler: addRedirectViewUsed(handlers.post),
  options:
    generatePayloadOptions(
      DEVELOPER_WRITTEN_AUTHORISATION_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION
    )
}]
