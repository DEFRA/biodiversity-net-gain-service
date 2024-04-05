import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const writtenAuthorisationId = '#writtenAuthorisation'

async function processSuccessfulUpload (result, request, h) {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, true))
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received written authorisation data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
    err: [{
      text: message,
      href: writtenAuthorisationId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select the written authorisation file')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, { fileId: writtenAuthorisationId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_WRITTEN_AUTHORISATION)
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
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.UPLOAD_WRITTEN_AUTHORISATION
    })

    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
    const clientsName = request.yar.get(constants.redisKeys.CLIENTS_NAME_KEY)
    const clientsOrganisationName = request.yar.get(constants.redisKeys.CLIENTS_ORGANISATION_NAME_KEY)
    const isIndividual = isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL

    return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
      isIndividual,
      clientsName,
      clientsOrganisationName
    })
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.WRITTEN_AUTHORISATION_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
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
  path: constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.post,
  options: generatePayloadOptions({ fileId: writtenAuthorisationId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_WRITTEN_AUTHORISATION)
}]
