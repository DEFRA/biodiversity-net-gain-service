import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { checkApplicantDetails, getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'

const LAND_OWNERSHIP_ID = '#landOwnership'

function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_FILE_TYPE, result.fileType)
    logger.log(`${new Date().toUTCString()} Received land ownership data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_PROOF_OF_OWNERSHIP
  }
  return h.redirect(resultView)
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file is empty',
          href: LAND_OWNERSHIP_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'Select a proof of land ownership file',
          href: LAND_OWNERSHIP_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumOwnershipProofFileSizeExceeded(h)
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: LAND_OWNERSHIP_ID
        }]
      })
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_LAND_OWNERSHIP, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: LAND_OWNERSHIP_ID
          }]
        })
      }
      throw err
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_LAND_OWNERSHIP
    })
    return h.view(constants.views.UPLOAD_LAND_OWNERSHIP)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    return uploadFiles(logger, request, config).then(
      function (result) {
        return processSuccessfulUpload(result, request, h)
      },
      function (err) {
        return processErrorUpload(err, h)
      }
    ).catch(err => {
      console.log(`Problem uploading file ${err}`)
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: LAND_OWNERSHIP_ID
        }]
      })
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
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
          return maximumOwnershipProofFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumOwnershipProofFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: LAND_OWNERSHIP_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.UPLOAD_LAND_OWNERSHIP
  })
}
