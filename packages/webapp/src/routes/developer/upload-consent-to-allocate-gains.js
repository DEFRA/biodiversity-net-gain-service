import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { isAgentAndNotLandowner } from '../../utils/helpers.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'

const DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID = '#uploadWrittenConsentToAllocateGains'

async function processSuccessfulUpload (result, request, h) {
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received consent written consent to allocate off-site gains file data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE)
}

const handlers = {
  get: async (request, h) => h.view(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
    [constants.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED]: isAgentAndNotLandowner(request.yar)
  }),
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_UPLOAD_TYPE,
      fileExt: constants.consentFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    try {
      const result = await uploadFile(request.logger, request, config)
      return await processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload({
        err,
        h,
        href: constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
        noFileErrorMessage: 'Select a written consent file',
        unsupportedFileExtErrorMessage: 'The selected file must be a DOC, DOCX or PDF',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS
    )
}]
