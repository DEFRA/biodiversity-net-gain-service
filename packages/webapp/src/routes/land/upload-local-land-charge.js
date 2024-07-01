import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const LOCAL_LAND_CHARGE_ID = '#localLandCharge'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION, true))
  request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.LOCAL_LAND_CHARGE_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received legal and search data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_LOCAL_LAND_CHARGE_FILE)
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_LOCAL_LAND_CHARGE)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LOCAL_LAND_CHARGE_UPLOAD_TYPE,
      fileExt: constants.localLandChargeFileExt,
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
        route: constants.views.UPLOAD_LOCAL_LAND_CHARGE,
        elementID: LOCAL_LAND_CHARGE_ID,
        noFileErrorMessage: 'Select a local land charge search certificate file',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      LOCAL_LAND_CHARGE_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LOCAL_LAND_CHARGE
    )
}]
