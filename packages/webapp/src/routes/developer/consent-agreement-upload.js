import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const DEVELOPER_WRITTEN_CONSENT_ID = '#uploadWrittenConsent'

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, result.fileType)
  request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME, result.filename)
  request.logger.info(`${new Date().toUTCString()} Received consent file data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_AGREEMENT_CHECK)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
        err: [{
          text: 'The selected file is empty',
          href: DEVELOPER_WRITTEN_CONSENT_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
        err: [{
          text: 'Select a written consent',
          href: DEVELOPER_WRITTEN_CONSENT_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: DEVELOPER_WRITTEN_CONSENT_ID
        }]
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: DEVELOPER_WRITTEN_CONSENT_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: DEVELOPER_WRITTEN_CONSENT_ID
          }]
        })
      } else {
        return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: DEVELOPER_WRITTEN_CONSENT_ID
          }]
        })
      }
  }
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD),
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_CONSENT_UPLOAD_TYPE,
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
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_CONSENT_AGREEMENT_UPLOAD,
  config: {
    handler: handlers.post,
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      output: 'stream',
      timeout: false,
      parse: false,
      multipart: true,
      allow: 'multipart/form-data',
      failAction: (_request, h, err) => {
        if (err.output.statusCode === 413) { // Request entity too large
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
    href: DEVELOPER_WRITTEN_CONSENT_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD
  })
}
