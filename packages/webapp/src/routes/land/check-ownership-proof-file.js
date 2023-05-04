import constants from '../../utils/constants.js'
import path from 'path'
import { checkApplicantDetails, getHumanReadableFileSize, processRegistrationTask } from '../../utils/helpers.js'
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
      await deleteBlobFromContainers(context.fileLocation)
      request.yar.clear(constants.redisKeys.LAND_OWNERSHIP_LOCATION)
      return h.redirect(constants.routes.UPLOAD_LAND_OWNERSHIP)
    } else if (checkLandOwnership === 'yes') {
      return request.yar.get(constants.redisKeys.ROLE_KEY) === 'Landowner'
        ? h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.REGISTERED_LANDOWNER)
        : h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ADD_LANDOWNERS)
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
    fileLocation,
    fileSize: humanReadableFileSize
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_PROOF_OF_OWNERSHIP,
  handler: handlers.post
}]
