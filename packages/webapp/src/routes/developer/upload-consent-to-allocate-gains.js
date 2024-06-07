import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, isAgentAndNotLandowner } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID = '#uploadWrittenConsentToAllocateGains'

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received consent written consent to allocate off-site gains file data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_CONSENT_TO_USE_GAIN_SITE_FILE)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
        err: [{
          text: 'The selected file is empty',
          href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
        err: [{
          text: 'Select a written consent',
          href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
        }]
      })
    default:
      if (err instanceof MalwareDetectedError) {
        return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
          }]
        })
      } else if (err instanceof ThreatScreeningError) {
        return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
          }]
        })
      } else {
        return h.redirectView(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID
          }]
        })
      }
  }
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
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
  handler: addRedirectViewUsed(handlers.get)
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS,
  config: {
    handler: addRedirectViewUsed(handlers.post),
    payload: {
      allow: 'multipart/form-data',
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      output: 'stream',
      parse: false,
      timeout: false,
      failAction: (_request, h, err) => {
        if (err.output.statusCode === 413) {
          return maximumFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: DEVELOPER_WRITTEN_CONSENT_TO_ALLOCATE_GAINS_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.DEVELOPER_UPLOAD_CONSENT_TO_ALLOCATE_GAINS
  })
}
