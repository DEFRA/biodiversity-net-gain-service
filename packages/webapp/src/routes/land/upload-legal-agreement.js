import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { processRegistrationTask, getLegalAgreementDocumentType, generateUniqueId } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const legalAgreementId = '#legalAgreement'

async function processSuccessfulUpload (result, request, h) {
  const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES) ?? []
  const location = result.config.blobConfig.blobName
  let id = legalAgreementFiles.find(file => file.location === location)?.id
  if (!id) {
    id = generateUniqueId()
    legalAgreementFiles.push({
      location,
      fileSize: result.fileSize,
      fileType: result.fileType,
      id
    })
  }
  request.logger.info(`${new Date().toUTCString()} Received legal agreement data for ${location.substring(location.lastIndexOf('/') + 1)}`)
  if (legalAgreementFiles.length > 0) {
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILES, legalAgreementFiles)
  }
  return h.redirect(`${constants.routes.CHECK_LEGAL_AGREEMENT}?id=${id}`)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
    err: [{
      text: message,
      href: legalAgreementId
    }]
  })
}

function processErrorUpload (err, h, legalAgreementType) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a legal agreement')
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, { legalAgreementType: legalAgreementId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB)
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
      inProgressUrl: constants.routes.UPLOAD_LEGAL_AGREEMENT
    })
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LEGAL_AGREEMENT_UPLOAD_TYPE,
      fileExt: constants.legalAgreementFileExt,
      maxFileSize: parseInt(process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB) * 1024 * 1024
    })
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    try {
      const result = await uploadFile(request.logger, request, config)
      return processSuccessfulUpload(result, request, h)
    } catch (err) {
      request.logger.error(`${new Date().toUTCString()} Problem uploading file ${err}`)
      return processErrorUpload(err, h, legalAgreementType)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_LEGAL_AGREEMENT,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LEGAL_AGREEMENT,
  handler: handlers.post,
  options: generatePayloadOptions({ legalAgreementType: legalAgreementId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_LEGAL_AGREEMENT)
}
]
