import constants from '../../utils/constants.js'
import { getHumanReadableFileSize } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const fileSize = request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
    const humanReadableFileSize = getHumanReadableFileSize(fileSize)
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      },
      filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
      fileSize: humanReadableFileSize
    }
    return h.view(constants.views.CHECK_GEOSPATIAL_FILE, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route

    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        route = request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LAND_BOUNDARY_DETAILS
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        break
      default:
        return h.view(constants.views.CHECK_GEOSPATIAL_FILE, {
          err: [{
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          }],
          filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
          fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE),
          humanReadableFileSize: parseFloat(parseFloat(request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE) / 1024 / 1024).toFixed(4))
        })
    }
    return h.redirect(route)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.post
}]
