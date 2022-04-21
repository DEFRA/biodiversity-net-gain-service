// import Joi from 'joi'
import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      }
    }
    return h.view(constants.views.CONFIRM_GEOSPATIAL_LAND_BOUNDARY, mapConfig)
  }
}

const confirmGeospatialLandBoundaryRoutes = [{
  method: 'GET',
  path: constants.routes.CONFIRM_GEOSPATIAL_LAND_BOUNDARY,
  handler: handlers.get
}]

export default confirmGeospatialLandBoundaryRoutes
