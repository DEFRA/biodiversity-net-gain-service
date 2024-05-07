import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { getLegalAgreementDocumentType, generateUniqueId } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'

const legalAgreementId = '#legalAgreement'

async function processSuccessfulUpload (result, request, h) {
  const legalAgreementFiles = request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_FILES) ?? []
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
    request.yar.set(constants.cacheKeys.LEGAL_AGREEMENT_FILES, legalAgreementFiles)
  }
  return h.redirect(`${constants.routes.CHECK_LEGAL_AGREEMENT}?id=${id}`)
}

const processErrorUpload = (err, h, legalAgreementType) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        legalAgreementType,
        err: [{
          text: 'The selected file is empty',
          href: legalAgreementId
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        legalAgreementType,
        err: [{
          text: 'Select a legal agreement',
          href: legalAgreementId
        }]
      })
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
        legalAgreementType,
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: legalAgreementId
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, legalAgreementType)
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: legalAgreementId
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: legalAgreementId
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: legalAgreementId
          }]
        })
      }
  }
}

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
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
    const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
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
        const legalAgreementType = getLegalAgreementDocumentType(request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
        if (err.output.statusCode === 413) { // Request entity too large
          return maximumFileSizeExceeded(h, legalAgreementType).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumFileSizeExceeded = (h, legalAgreementType) => {
  return h.view(constants.views.UPLOAD_LEGAL_AGREEMENT, {
    legalAgreementType,
    err: [
      {
        text: `The selected file must not be larger than ${process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB}MB`,
        href: legalAgreementId
      }
    ]
  })
}
