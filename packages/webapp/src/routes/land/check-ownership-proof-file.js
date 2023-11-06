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

    const ownershipProofs = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_PROOFS) || []
    const fileName = path.basename(context.fileLocation || '')

    if (checkLandOwnership === 'no') {
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.LAND_OWNERSHIP_LOCATION)
      const _ownershipProofs = ownershipProofs.filter((item) => item === fileName)
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, _ownershipProofs)
      return h.redirect(constants.routes.UPLOAD_LAND_OWNERSHIP)
    } else if (checkLandOwnership === 'yes') {
      if (ownershipProofs.indexOf(fileName) === -1) {
        ownershipProofs.push(fileName)
      }
      request.yar.set(constants.redisKeys.LAND_OWNERSHIP_PROOFS, ownershipProofs)
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
  const fileLocation = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_LOCATION)
  const fileSize = request.yar.get(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE)
  const humanReadableFileSize = getHumanReadableFileSize(fileSize)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: humanReadableFileSize,
    fileLocation
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
