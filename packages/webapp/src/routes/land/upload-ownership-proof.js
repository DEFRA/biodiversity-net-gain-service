import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { generateUniqueId } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import path from 'path'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const LAND_OWNERSHIP_ID = '#landOwnership'

async function processSuccessfulUpload (result, request, h) {
  const tempFile = request.yar.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
  if (tempFile && !tempFile.confirmed) {
    await deleteBlobFromContainers(tempFile.fileLocation)
  }
  const tempFileDetails = {
    id: generateUniqueId(),
    fileName: path.parse(result.config.blobConfig.blobName).base,
    fileLocation: result.config.blobConfig.blobName,
    fileSize: result.fileSize,
    fileType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
    contentMediaType: result.fileType,
    confirmed: false
  }
  request.yar.set(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF, tempFileDetails)
  request.yar.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, result.config.blobConfig.blobName)
  return getNextStep(request, h)
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_LAND_OWNERSHIP)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
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
        route: constants.views.UPLOAD_LAND_OWNERSHIP,
        elementID: LAND_OWNERSHIP_ID,
        noFileErrorMessage: 'Select a proof of land ownership file',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      LAND_OWNERSHIP_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LAND_OWNERSHIP
    )
}
]
