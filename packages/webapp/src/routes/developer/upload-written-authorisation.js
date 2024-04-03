import { logger } from '@defra/bng-utils-lib'
import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const WRITTEN_AUTHORISATION_ID = '#writtenAuthorisation'

const addMultipleProofsOfPermissionIndicatorToContextIfRquired = (yar, context) => {
  const isAgent = yar.get(constants.cacheKeys.DEVELOPER_IS_AGENT) === constants.APPLICANT_IS_AGENT.YES
  const clientIsNotLandownerOrLeaseholder = yar.get(constants.cacheKeys.DEVELOPER_LANDOWNER_OR_LEASEHOLDER) === constants.DEVELOPER_IS_LANDOWNER_OR_LEASEHOLDER.NO
  if (isAgent && clientIsNotLandownerOrLeaseholder) {
    context[constants.MULTIPLE_PROOFS_OF_PERMISSION_REQUIRED] = true
  }
  return context
}

const processSuccessfulUpload = (result, request, h) => {
  request.yar.set(constants.cacheKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION, result.config.blobConfig.blobName)
  request.yar.set(constants.cacheKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_SIZE, result.fileSize)
  request.yar.set(constants.cacheKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILE_TYPE, result.fileType)
  logger.info(`${new Date().toUTCString()} Received written authorisation data for ${result.config.blobConfig.blobName.substring(result.config.blobConfig.blobName.lastIndexOf('/') + 1)}`)
  return h.redirect(constants.routes.DEVELOPER_CHECK_WRITTEN_AUTHORISATION_FILE)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'The selected file is empty',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'Select the written authorisation file',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumSizeExceeded(h)
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: WRITTEN_AUTHORISATION_ID
        }]
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.DEVELOPER_.UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
      } else {
        return h.view(constants.views.DEVELOPER_.UPLOAD_WRITTEN_AUTHORISATION, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: WRITTEN_AUTHORISATION_ID
          }]
        })
      }
  }
}

const maximumSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: WRITTEN_AUTHORISATION_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION
  })
}

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION
    })

    const isIndividualOrOrganisation = request.yar.get(constants.cacheKeys.DEVELOPER_CLIENT_INDIVIDUAL_ORGANISATION)
    const clientsName = request.yar.get(constants.cacheKeys.DEVELOPER_CLIENTS_NAME_KEY)
    const clientsOrganisationName = request.yar.get(constants.cacheKeys.DEVELOPER_CLIENTS_ORGANISATION_NAME_KEY)
    const isIndividual = isIndividualOrOrganisation === constants.individualOrOrganisationTypes.INDIVIDUAL

    const context = {
      isIndividual,
      clientsName,
      clientsOrganisationName
    }

    return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION, addMultipleProofsOfPermissionIndicatorToContextIfRquired(request.yar, context))
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.DEVELOPER_WRITTEN_AUTHORISATION_UPLOAD_TYPE,
      fileExt: constants.lanOwnerFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    try {
      const result = await uploadFile(logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h)
    }
  }
}

const failAction = (request, h, err) => {
  logger.error(`${new Date().toUTCString()} File upload too large ${request.path}`)
  if (err.output.statusCode === 413) { // Request entity too large
    return maximumSizeExceeded(h).takeover()
  } else {
    throw err
  }
}

const payload = {
  maxBytes: (parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) + 1) * 1024 * 1024,
  multipart: true,
  timeout: false,
  output: 'stream',
  parse: false,
  allow: 'multipart/form-data',
  failAction
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.post,
  options: {
    payload
  }
}]
