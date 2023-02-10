import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { processRegistrationTask } from '../../utils/helpers.js'

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
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: context.fileLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
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
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.LAND_OWNERSHIP_FILE_SIZE),
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
