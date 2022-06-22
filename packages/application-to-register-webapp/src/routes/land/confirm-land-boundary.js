import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      }
    }
    return h.view(constants.views.CONFIRM_GEOSPATIAL_LAND_BOUNDARY, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route
    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        // TO DO - Set the route associated with land boundary confirmation when implemented.
        route = constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY
        break
      case constants.confirmLandBoundaryOptions.NO_AGAIN:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.LAND_BOUNDARY_UPLOAD_TYPE
        break
      default:
        // This should not happen.
        throw new Error(`Unexpected geospatial land boundary confirmation response ${request.payload.confirmGeospatialLandBoundary}`)
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
