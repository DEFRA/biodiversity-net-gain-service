import constants from '../../utils/constants.js'
import { getHumanReadableFileSize } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'
import path from 'path'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    if (!context.fileName || !context.fileSize) {
      const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
      return isCombinedCase
        ? h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
        : h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
    }
    return h.view(constants.views.CHECK_PROOF_OF_OWNERSHIP, context)
  },
  post: async (request, h) => {
    const checkLandOwnership = request.payload.checkLandOwnership
    const { id } = request.query
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_CHECKED, checkLandOwnership)
    if (checkLandOwnership === 'no') {
      const lopFiles = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS) || []
      await deleteBlobFromContainers(context.fileLocation)
      const updatedLopFiles = lopFiles.filter(item => item.id !== id)
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, updatedLopFiles)
      return getNextStep(request, h)
    } else if (checkLandOwnership === 'yes') {
      const tempFile = request.yar.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
      if (tempFile && tempFile.id === id) {
        const lopFiles = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS) || []
        const duplicateIndex = lopFiles.findIndex(file => path.basename(file.fileLocation) === path.basename(tempFile.fileLocation))
        tempFile.confirmed = true
        if (duplicateIndex === -1) {
          tempFile.confirmed = true
          const { confirmed, ...fileToAdd } = tempFile
          lopFiles.push(fileToAdd)
          request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, lopFiles)
        }
        request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, lopFiles)
        request.yar.clear(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
      }
      return getNextStep(request, h)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_PROOF_OF_OWNERSHIP, context)
    }
  }
}

const getContext = request => {
  const tempFile = request.yar.get(constants.redisKeys.TEMP_LAND_OWNERSHIP_PROOF)
  let fileDetails = {
    fileName: '',
    fileSize: '',
    fileLocation: '',
    fileId: ''
  }
  if (tempFile) {
    fileDetails = {
      fileName: tempFile.fileName || '',
      fileSize: getHumanReadableFileSize(tempFile.fileSize),
      fileLocation: tempFile.fileLocation || '',
      fileId: tempFile.id || ''
    }
  }
  return fileDetails
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  handler: handlers.post
}]
