import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { generateUniqueId } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import path from 'path'

const landOwnershipId = '#landOwnership'

const processSuccessfulUpload = async (result, request, h) => {
  const tempFile = request.yar.get(constants.cacheKeys.TEMP_LAND_OWNERSHIP_PROOF)
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
  request.yar.set(constants.cacheKeys.TEMP_LAND_OWNERSHIP_PROOF, tempFileDetails)
  return h.redirect(`${constants.routes.CHECK_PROOF_OF_OWNERSHIP}?id=${tempFileDetails.id}`)
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
        href: constants.views.UPLOAD_LAND_OWNERSHIP,
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
      landOwnershipId,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LAND_OWNERSHIP
    )
}
]
