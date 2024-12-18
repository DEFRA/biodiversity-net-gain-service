import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
import { deleteBlobFromContainersWithCheck } from '../../utils/azure-storage.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const HABITAT_PLAN_ID = '#uploadHabitatPlan'

async function processSuccessfulUpload (result, request, h) {
  const blobPath = result.config.blobConfig.blobName
  const previousBlobPath = request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION, true)
  await deleteBlobFromContainersWithCheck(blobPath, previousBlobPath)
  request.yar.set(constants.redisKeys.HABITAT_PLAN_LOCATION, blobPath)
  request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received legal and search data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return getNextStep(request, h)
}

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_HABITAT_PLAN)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.HABITAT_PLAN_UPLOAD_TYPE,
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
        route: constants.views.UPLOAD_HABITAT_PLAN,
        elementID: HABITAT_PLAN_ID,
        noFileErrorMessage: 'Select a habitat management and monitoring plan',
        maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_HABITAT_PLAN,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_HABITAT_PLAN,
  handler: handlers.post,
  options:
    generatePayloadOptions(
      HABITAT_PLAN_ID,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_HABITAT_PLAN
    )
}]
