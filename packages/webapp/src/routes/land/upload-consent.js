import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFiles } from '../../utils/upload.js'
import {
  processRegistrationTask
} from '../../utils/helpers.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'

const landownerPermissionUploadId = '#landownerPermissionId'

function processSuccessfulUpload (result, request, h) {
  let resultView = constants.views.INTERNAL_SERVER_ERROR
  if (result[0].errorMessage === undefined) {
    request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_LOCATION, result[0].location)
    request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_FILE_SIZE, result.fileSize)
    request.yar.set(constants.redisKeys.LANDOWNER_PERMISSION_UPLOAD_FILE_TYPE, result.fileType)
    resultView = constants.routes.LANDOWNER_PERMISSION_CHECK
  }
  return h.redirect(resultView)
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.LANDOWNER_PERMISSION_UPLOAD, {
        err: [{
          text: 'The selected file is empty',
          href: landownerPermissionUploadId
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.LANDOWNER_PERMISSION_UPLOAD, {
        err: [{
          text: 'Select a landowner written consent',
          href: landownerPermissionUploadId
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.LANDOWNER_PERMISSION_UPLOAD, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: landownerPermissionUploadId
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, landownerPermissionUploadId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.LANDOWNER_PERMISSION_UPLOAD)
    default:
      if (err.message.indexOf('timed out') > -1) {
        return h.redirect(constants.views.LANDOWNER_PERMISSION_UPLOAD, {
          err: [{
            text: 'The selected file could not be uploaded -- try again',
            href: landownerPermissionUploadId
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
      title: 'Consent to register the biodiversity gain site'
    }, {
      inProgressUrl: constants.routes.LANDOWNER_PERMISSION_UPLOAD
    })

    return h.view(constants.views.LANDOWNER_PERMISSION_UPLOAD)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LANDOWNER_PERMISSION_UPLOAD_TYPE,
      fileExt: constants.landownerPermissionFileExt,
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
      return h.view(constants.views.LANDOWNER_PERMISSION_UPLOAD, {
        err: [{
          text: 'The selected file could not be uploaded -- try again',
          href: landownerPermissionUploadId
        }]
      })
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_PERMISSION_UPLOAD,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.LANDOWNER_PERMISSION_UPLOAD,
  handler: handlers.post,
  options: generatePayloadOptions(landownerPermissionUploadId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.LANDOWNER_PERMISSION_UPLOAD)
}
]
