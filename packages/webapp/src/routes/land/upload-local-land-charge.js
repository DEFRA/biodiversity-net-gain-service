import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const localLandChargeId = '#localLandChargeId'
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
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add local land charge search certificate'
    }, {
      inProgressUrl: constants.routes.UPLOAD_LOCAL_LAND_CHARGE,
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS
    })
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
      return processErrorUpload(err, h, constants.views.UPLOAD_LOCAL_LAND_CHARGE)
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
      localLandChargeId,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_LOCAL_LAND_CHARGE
    )
}]
