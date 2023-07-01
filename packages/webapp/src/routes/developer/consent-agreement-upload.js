import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, processDeveloperTask } from '../../utils/helpers.js'

const DEVELOPER_WRITTEN_CONSENT_ID = '#uploadWrittenConsent'

async function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR

  if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_TYPE, result.fileType)
    request.yar.set(constants.redisKeys.DEVELOPER_CONSENT_FILE_NAME, result.filename)
    logger.log(`${new Date().toUTCString()} Received consent file data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    processDeveloperTask(request,
      {
        taskTitle: 'Consent to use a biodiversity gain site for off-site gain',
        title: 'Upload the consent document'
      }, { status: constants.IN_PROGRESS_DEVELOPER_TASK_STATUS })
    resultView = constants.routes.DEVELOPER_AGREEMENT_CHECK
  }

  return h.redirect(resultView)
}

function processErrorUpload (err, h) {
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
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: DEVELOPER_WRITTEN_CONSENT_ID
          }]
        })
      }
      throw err
  }
}

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD),
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_CONSENT_UPLOAD_TYPE,
      fileExt: constants.consentFileExt,
      maxFileSize: parseInt(process.env.MAX_CONSENT_UPLOAD_MB) * 1024 * 1024
    })
    return uploadFiles(logger, request, config).then(
      function (result) {
        return processSuccessfulUpload(result, request, h)
      },
      function (err) {
        return processErrorUpload(err, h)
      }
    ).catch(err => {
      logger.log(`Problem uploading file ${err}`)
      return h.view(constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: DEVELOPER_WRITTEN_CONSENT_ID
        }]
      })
    })
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
    maximumFileSize: process.env.MAX_CONSENT_UPLOAD_MB,
    view: constants.views.DEVELOPER_CONSENT_AGREEMENT_UPLOAD
  })
}
