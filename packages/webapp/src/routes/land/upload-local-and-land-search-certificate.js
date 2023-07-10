import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import { checkApplicantDetails, getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'

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

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
        err: [{
          text: 'The selected file is empty',
          href: localChargeSearchCertificateId
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
        err: [{
          text: 'Select a local and search agreement',
          href: localChargeSearchCertificateId
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: localChargeSearchCertificateId
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err.message.indexOf('timed out') > 0) {
        return h.redirect(constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: localChargeSearchCertificateId
          }]
        })
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
    href: localChargeSearchCertificateId,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.UPLOAD_LOCAL_AND_LAND_CHARGE
  })
}
