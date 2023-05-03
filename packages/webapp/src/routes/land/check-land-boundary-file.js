import constants from '../../utils/constants.js'
import path from 'path'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land boundary details'
    }, {
      inProgressUrl: constants.routes.CHECK_LAND_BOUNDARY
    })
    return h.view(constants.views.CHECK_LAND_BOUNDARY, getContext(request))
  },
  post: async (request, h) => {
    const checkLandBoundary = request.payload.checkLandBoundary
    const landBoundaryLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, checkLandBoundary)
    if (checkLandBoundary === 'no') {
      await deleteBlobFromContainers(landBoundaryLocation)
      request.yar.clear(constants.redisKeys.LAND_BOUNDARY_LOCATION)
      return h.redirect(constants.routes.UPLOAD_LAND_BOUNDARY)
    } else if (checkLandBoundary === 'yes') {
      // to use referer we must have a LAND_BOUNDARY_GRID_REFERENCE set
      return h.redirect((request.yar.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE) && request.yar.get(constants.redisKeys.REFERER, true)) ||
        constants.routes.ADD_GRID_REFERENCE)
    } else {
      return h.view(constants.views.CHECK_LAND_BOUNDARY, {
        filename: path.basename(landBoundaryLocation),
        err: [
          {
            text: 'Select yes if this is the correct file',
            href
          }
        ]
      })
    }
  }
}

const getContext = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
  const location = fileLocation === null ? '' : path.parse(fileLocation).base
  const size = request.yar.get(constants.redisKeys.LAND_BOUNDARY_FILE_SIZE)
  return {
    filename: location,
    fileSize: size
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LAND_BOUNDARY,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_LAND_BOUNDARY,
  handler: handlers.post
}]
