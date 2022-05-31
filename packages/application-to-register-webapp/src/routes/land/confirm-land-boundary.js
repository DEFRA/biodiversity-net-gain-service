// import Joi from 'joi'
import constants from '../../utils/constants.js'
import { logger } from 'defra-logging-facade'

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
      case 'yes':
        // TO DO - Set the route associated with land boundary confirmation when implemented.
        route = constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY
        break
      case 'noAgain':
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        break
      case 'no':
        route = constants.routes.LAND_BOUNDARY_UPLOAD_TYPE
        break
      default:
        // This should not happen.
        logger.log(`Unexpected geospatial land boundary confirmation response ${request.payload.confirmGeospatialLandBoundary}`)
        route = constants.routes.ERROR
        break
    }
    return h.redirect(route)
  }
}

const confirmGeospatialLandBoundaryRoutes = [{
  method: 'GET',
  path: constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.post
}]

export default confirmGeospatialLandBoundaryRoutes
