import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const href = '#check-upload-correct-yes'
const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_LAND_BOUNDARY, context)
  },
  post: async (request, h) => {
    const checkLandBoundary = request.payload.checkLandBoundary
    const landBoundaryLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_CHECKED, checkLandBoundary)
    if (checkLandBoundary === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: landBoundaryLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.LAND_BOUNDARY_LOCATION)
      return h.redirect(constants.routes.UPLOAD_LAND_BOUNDARY)
    } else if (checkLandBoundary === 'yes') {
      return h.redirect(constants.routes.ADD_GRID_REFERENCE)
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

const getContext = async request => {
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
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LAND_BOUNDARY,
  handler: handlers.post
}]
