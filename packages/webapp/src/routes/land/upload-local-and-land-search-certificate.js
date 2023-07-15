import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'

const localChargeSearchCertificateId = '#localChargeSearchCertificate'
function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.LOCAL_AND_SEARCH_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.LOCAL_AND_CHARGE_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.LOCAL_AND_SEARCH_FILE_TYPE, result.fileType)
    logger.log(`${new Date().toUTCString()} Received legal and search data for ${result[0].location.substring(result[0].location.lastIndexOf('/') + 1)}`)
    resultView = constants.routes.CHECK_LOCAL_AND_SEARCH_FILE
  }
  return h.redirect(resultView)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
    err: [{
      text: message,
      href: localChargeSearchCertificateId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a local and search agreement')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')

    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, localChargeSearchCertificateId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE)
    default:
      if (err.message.indexOf('timed out') > 0) {
        return buildErrorResponse(h, 'The selected file could not be uploaded -- try again')
      }
      throw err
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add local and charge search certificate'
    }, {
      inProgressUrl: constants.routes.UPLOAD_LOCAL_AND_LAND_CHARGE,
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS
    })
    return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LOCAL_AND_SEARCH_UPLOAD_TYPE,
      fileExt: constants.localSearchFileExt,
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
      return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: localChargeSearchCertificateId
        }]
      })
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LOCAL_AND_LAND_CHARGE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LOCAL_AND_LAND_CHARGE,
  handler: handlers.post,
  options: generatePayloadOptions(localChargeSearchCertificateId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE)
}
]
