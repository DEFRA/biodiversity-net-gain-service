import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions } from '../../utils/generate-payload-options.js'
import { processErrorUpload } from '../../utils/upload-error-handler.js'
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

const handlers = {
  get: async (request, h) => {
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
    console.log('Hello from postHandler')
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
      console.log('Hello from postHandler err catch')
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h, constants.views.UPLOAD_WRITTEN_AUTHORISATION)
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
  options:
    generatePayloadOptions(
      writtenAuthorisationId,
      process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
      constants.views.UPLOAD_WRITTEN_AUTHORISATION
    )
}]
