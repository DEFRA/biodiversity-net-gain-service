import constants from '../../utils/constants.js'
import path from 'path'
import { getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      inProgressUrl: constants.routes.CHECK_PROOF_OF_OWNERSHIP
    })
    return h.view(constants.views.CHECK_PROOF_OF_OWNERSHIP, getContext(request))
  },
  post: async (request, h) => {
    const checkLandOwnership = request.payload.checkLandOwnership
    const context = getContext(request)
    request.yar.set(constants.redisKeys.LAND_OWNERSHIP_CHECKED, checkLandOwnership)

    if (checkLandOwnership === 'no') {
      const { id } = request.query
      const lopFiles = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
      await deleteBlobFromContainers(context.fileLocation)
      const updatedLopFiles = lopFiles.filter(item => item.id !== id)
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, updatedLopFiles)
      return h.redirect(constants.routes.UPLOAD_LAND_OWNERSHIP)
    } else if (checkLandOwnership === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LAND_OWNERSHIP_PROOF_LIST)
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
  const { id } = request.query
  let lopFile
  let fileLocation = ''
  let fileName = ''
  let fileSize = null
  let humanReadableFileSize = ''
  const lopFiles = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS)
  if (id) {
    lopFile = lopFiles.find(item => item.id === id)
    fileLocation = lopFile.location
    fileName = fileLocation === null ? '' : path.parse(fileLocation).base
    fileSize = lopFile.fileSize
    humanReadableFileSize = getHumanReadableFileSize(fileSize)
  }
  return {
    fileName,
    fileSize: humanReadableFileSize,
    fileLocation,
    fileId: id
  }
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
