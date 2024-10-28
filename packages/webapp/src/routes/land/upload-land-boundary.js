import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const LAND_BOUNDARY_ID = '#landBoundary'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION, true))
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.LAND_BOUNDARY_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received land boundary data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)

  return getNextStep(request, h)
}

const handlers = {
  get: async (request, h) => {
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
      return processErrorUpload({
        err,
        h,
        route: constants.views.UPLOAD_LAND_BOUNDARY,
        elementID: LAND_BOUNDARY_ID,
        noFileErrorMessage: 'Select a file showing the land boundary',
        unsupportedFileExtErrorMessage: 'The selected file must be a DOC, DOCX, JPG, PNG or PDF',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
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
      LAND_BOUNDARY_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LAND_BOUNDARY
    )
}]
