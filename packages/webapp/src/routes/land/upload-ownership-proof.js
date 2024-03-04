import { buildConfig } from '../../utils/build-upload-config.js'
import constants from '../../utils/constants.js'
import { uploadFile } from '../../utils/upload.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import { generateUniqueId, getMaximumFileSizeExceededView, processRegistrationTask } from '../../utils/helpers.js'
import { ThreatScreeningError, MalwareDetectedError } from '@defra/bng-errors-lib'
import path from 'path'

const LAND_OWNERSHIP_ID = '#landOwnership'

const processSuccessfulUpload = async (result, request, h) => {
  const tempFile = request.yar.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
  if (tempFile && !tempFile.confirmed) {
    await deleteBlobFromContainers(tempFile.fileLocation)
  }
  const tempFileDetails = {
    id: generateUniqueId(),
    fileName: path.parse(result.config.blobConfig.blobName).base,
    fileLocation: result.config.blobConfig.blobName,
    fileSize: result.fileSize,
    fileType: result.fileType,
    confirmed: false
  }
  request.yar.set(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF, tempFileDetails)
  return h.redirect(`${constants.routes.CHECK_PROOF_OF_OWNERSHIP}?id=${tempFileDetails.id}`)
}

const processErrorUpload = (err, h) => {
  switch (err.message) {
    case constants.uploadErrors.emptyFile:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file is empty',
          href: LAND_OWNERSHIP_ID
        }]
      })
    case constants.uploadErrors.noFile:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'Select a proof of land ownership file',
          href: LAND_OWNERSHIP_ID
        }]
      })
    case constants.uploadErrors.maximumFileSizeExceeded:
      return maximumOwnershipProofFileSizeExceeded(h)
    case constants.uploadErrors.unsupportedFileExt:
      return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
        err: [{
          text: 'The selected file must be a DOC, DOCX or PDF',
          href: LAND_OWNERSHIP_ID
        }]
      })
    default:
      if (err instanceof ThreatScreeningError) {
        return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
          err: [{
            text: constants.uploadErrors.malwareScanFailed,
            href: LAND_OWNERSHIP_ID
          }]
        })
      } else if (err instanceof MalwareDetectedError) {
        return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
          err: [{
            text: constants.uploadErrors.threatDetected,
            href: LAND_OWNERSHIP_ID
          }]
        })
      } else {
        return h.view(constants.views.UPLOAD_LAND_OWNERSHIP, {
          err: [{
            text: constants.uploadErrors.uploadFailure,
            href: LAND_OWNERSHIP_ID
          }]
        })
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
          return maximumOwnershipProofFileSizeExceeded(h).takeover()
        } else {
          throw err
        }
      }
    }
  }
}
]

const maximumOwnershipProofFileSizeExceeded = h => {
  return getMaximumFileSizeExceededView({
    h,
    href: LAND_OWNERSHIP_ID,
    maximumFileSize: process.env.MAX_GEOSPATIAL_LAND_BOUNDARY_UPLOAD_MB,
    view: constants.views.UPLOAD_LAND_OWNERSHIP
  })
}
