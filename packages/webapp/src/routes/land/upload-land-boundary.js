import { logger } from 'defra-logging-facade'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { processRegistrationTask, getMaximumFileSizeExceededView } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const LAND_BOUNDARY_ID = '#landBoundary'

async function processSuccessfulUpload (result, request, h) {
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, result.fileType)
  logger.log(`${new Date().toUTCString()} Received land boundary data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)

  // Clear out any geospatial data and files
  request.yar.clear(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_FILE_NAME)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_FILE_TYPE)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_HECTARES)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE)
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION))
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION))
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION))
  request.yar.clear(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION)
  request.yar.clear(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION)
  request.yar.clear(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION)

  return h.redirect(constants.routes.CHECK_LAND_BOUNDARY)
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
        err: [{
          text: 'The selected file is empty',
          href: LAND_BOUNDARY_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
        err: [{
          text: 'Select a file showing the land boundary',
          href: LAND_BOUNDARY_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
        err: [{
          text: 'The selected file must be a DOC, DOCX, JPG, PNG or PDF',
          href: LAND_BOUNDARY_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: LAND_BOUNDARY_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: LAND_BOUNDARY_ID
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_LAND_BOUNDARY, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: LAND_BOUNDARY_ID
          }]
        })
      }
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add biodiversity gain site boundary details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_LAND_BOUNDARY
    })
    return h.view(constants.views.UPLOAD_LAND_BOUNDARY)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LAND_BOUNDARY_UPLOAD_TYPE,
      fileExt: constants.landBoundaryFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    try {
      const result = await uploadFile(logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.log(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LAND_BOUNDARY,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LAND_BOUNDARY,
  handler: handlers.post,
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024) + 250,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        logger.log(`${new Date().toUTCString()} File upload too large ${request.path}`)
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
    href: LAND_BOUNDARY_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.UPLOAD_LAND_BOUNDARY
  })
}
