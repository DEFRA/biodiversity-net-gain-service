import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      },
      filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
      fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
    }
    return h.view(constants.views.CONFIRM_GEOSPATIAL_LAND_BOUNDARY, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route
    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        route = constants.routes.CHECK_LAND_BOUNDARY_DETAILS
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        break
      default:
        return h.view(constants.views.CONFIRM_GEOSPATIAL_LAND_BOUNDARY, {
          err: [{
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          }],
          filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
          fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
        })
    }
    return h.redirect(route)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.post
}]
