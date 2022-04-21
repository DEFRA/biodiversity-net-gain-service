// import Joi from 'joi'
import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.LAND_BOUNDARY_UPLOAD_TYPE, {
      ...context
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    const route =
      request.payload.landBoundaryUploadType === constants.landBoundaryUploadTypes.GEOSPATIAL_DATA
        ? constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        : constants.routes.UPLOAD_LAND_BOUNDARY_DOCUMENT

    return h.redirect(route)
  }
}

const getContext = async (request) => {
  const landBoundaryUploadType = request.yar.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE)
  let context
  if (landBoundaryUploadType) {
    context = {
      landBoundaryUploadType
    }
  }
  return context
}

const landBoundaryUploadTypeRoutes = [{
  method: 'GET',
  path: constants.routes.LAND_BOUNDARY_UPLOAD_TYPE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_BOUNDARY_UPLOAD_TYPE,
  handler: handlers.post
}]

export default landBoundaryUploadTypeRoutes
