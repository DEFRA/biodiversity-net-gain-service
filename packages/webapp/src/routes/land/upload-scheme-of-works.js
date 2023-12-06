import { logger } from 'defra-logging-facade'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const uploadSchemeOfWorksId = '#uploadSchemeOfWorks'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION, true))
  request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.SCHEME_OF_WORKS_FILE_TYPE, result.fileType)
  logger.log(`${new Date().toUTCString()} Received legal and search data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_SCHEME_OF_WORKS_FILE)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_SCHEME_OF_WORKS, {
    err: [{
      text: message,
      href: uploadSchemeOfWorksId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a scheme of works file')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, uploadSchemeOfWorksId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_HABITAT_PLAN)
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
      inProgressUrl: constants.routes.UPLOAD_SCHEME_OF_WORKS
    })
    return h.view(constants.views.UPLOAD_SCHEME_OF_WORKS)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.SCHEME_OF_WORKS_UPLOAD_TYPE,
      fileExt: constants.schemeOfWorksFileExt,
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
  path: constants.routes.UPLOAD_SCHEME_OF_WORKS,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_SCHEME_OF_WORKS,
  handler: handlers.post,
  options: generatePayloadOptions(uploadSchemeOfWorksId, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_SCHEME_OF_WORKS)
}
]
