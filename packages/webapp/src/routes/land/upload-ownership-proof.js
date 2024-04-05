import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { generatePayloadOptions, maximumFileSizeExceeded } from '../../utils/generate-payload-options.js'
import { generateUniqueId, processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import path from 'path'

const landOwnershipId = '#landOwnership'

async function processSuccessfulUpload (result, request, h) {
  const lopFiles = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS) || []
  const location = result.config.blobConfig.blobName
  const fileName = path.parse(location).base
  let id = lopFiles.length > 0 && lopFiles.find(file => path.basename(file.fileLocation) === path.basename(location))?.id
  if (!id) {
    id = generateUniqueId()
    lopFiles.push({
      fileName,
      fileLocation: location,
      fileSize: result.fileSize,
      fileType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
      contentMediaType: result.fileType,
      id
    })
  }
  request.logger.info(`${new Date().toUTCString()} Received land ownership data for ${location.substring(location.lastIndexOf('/') + 1)}`)
  request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, lopFiles)
  return h.redirect(`${constants.routes.CHECK_PROOF_OF_OWNERSHIP}?id=${id}`)
}

function buildErrorResponse (h, message) {
  return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
    err: [{
      text: message,
      href: landOwnershipId
    }]
  })
}

function processErrorUpload (err, h) {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return buildErrorResponse(h, 'The selected file is empty')
    case constants.uploadErrors.noFile:
      return buildErrorResponse(h, 'Select a proof of land ownership file')
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumFileSizeExceeded(h, { fileId: landOwnershipId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_LAND_OWNERSHIP)
    case constants.uploadErrors.unsupportedFileExt:
      return buildErrorResponse(h, 'The selected file must be a DOC, DOCX or PDF')
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
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.UPLOAD_LAND_OWNERSHIP
    })
    return h.view(constants.views.UPLOAD_LAND_OWNERSHIP)
  },
  post: async (request, h) => {
    const config = buildConfig({
      sessionId: request.yar.id,
      uploadType: constants.uploadTypes.LAND_OWNERSHIP_UPLOAD_TYPE,
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
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.UPLOAD_LAND_OWNERSHIP,
  handler: handlers.post,
  options: generatePayloadOptions({ fileId: landOwnershipId }, process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB, constants.views.UPLOAD_LAND_OWNERSHIP)
}
]
