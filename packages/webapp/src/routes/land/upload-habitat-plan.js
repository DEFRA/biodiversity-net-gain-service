import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const uploadHabitatPlanId = '#uploadHabitatPlanId'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.HABITAT_PLAN_LOCATION, true))
  request.yar.set(constants.redisKeys.HABITAT_PLAN_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.HABITAT_PLAN_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received legal and search data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_HABITAT_PLAN_FILE)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_HABITAT_PLAN, {
    err: [{
      text: message,
      href: uploadHabitatPlanId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a habitat management and monitoring plan')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, uploadHabitatPlanId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_HABITAT_PLAN)
    default:
      if (err instanceof ThreatScreeningError) {
        return buildErrorResponse(h, constants.uploadErrors.malwareScanFailed)
      } else if (err instanceof MalwareDetectedError) {
        return buildErrorResponse(h, constants.uploadErrors.threatDetected)
      } else {
        return buildErrorResponse(h, constants.uploadErrors.uploadFailure)
      }
  }
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.UPLOAD_HABITAT_PLAN
    })
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
      return processErrorUpload(err, h)
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
  options: generatePayloadOptions(uploadHabitatPlanId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_HABITAT_PLAN)
}
]
