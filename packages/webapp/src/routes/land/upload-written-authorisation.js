import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { maximumFileSizeExceeded } from '../../utils/upload-helpers.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const WRITTEN_AUTHORISATION_ID = '#writtenAuthorisation'

const processSuccessfulUpload = async (result, request, h) => {
  await deleteBlobFromContainers(request.yar.get(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, true))
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_SIZE, result.fileSize)
  request.yar.set(constants.redisKeys.WRITTEN_AUTHORISATION_FILE_TYPE, result.fileType)
  request.logger.info(`${new Date().toUTCString()} Received written authorisation data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.CHECK_WRITTEN_AUTHORISATION_FILE)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'The selected file is empty',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'Select the written authorisation file',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: `The selected file must be less than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`,
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
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
  options: {
    payload: {
      maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
      multipart: true,
      timeout: false,
      output: 'stream',
      parse: false,
      allow: 'multipart/form-data',
      failAction: (request, h, err) => {
        request.logger.info(`${new Date().toUTCString()} File upload too large ${request.path}`)
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h, WRITTEN_AUTHORISATION_ID, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_WRITTEN_AUTHORISATION)
            .takeover()
        } else {
          throw err
        }
      }
    }
  }
}]
