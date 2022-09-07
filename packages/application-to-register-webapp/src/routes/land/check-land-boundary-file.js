import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      },
      filename: request.yar.get(constants.redisKeys.FILE_NAME),
      fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE)
    }
    return h.view(constants.views.CHECK_LAND_BOUNDARY, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route
    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        route = constants.routes.CHECK_LAND_BOUNDARY
        break
      case constants.confirmLandBoundaryOptions.NO_AGAIN:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.LAND_BOUNDARY_UPLOAD_TYPE
        break
      default:
        return h.view(constants.views.CHECK_LAND_BOUNDARY, {
          err: [{
            text: 'Select yes if this is the correct file',
            href: 'check-upload-correct'
          }],
          filename: request.yar.get(constants.redisKeys.FILE_NAME),
          fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE)
        })
    }
    return h.redirect(route)
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
