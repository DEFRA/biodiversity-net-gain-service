import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const landBoundaryId = '#landBoundary'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION, true))
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received land boundary data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)

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
      const result = await uploadFile(request.logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h, constants.views.UPLOAD_LAND_BOUNDARY)
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
  options:
    generatePayloadOptions(
      landBoundaryId,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LAND_BOUNDARY
    )
}]
