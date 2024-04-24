import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.CHOOSE_LAND_BOUNDARY_UPLOAD, {
      ...context
    })
  },
  post: async (request, h) => {
    const context = getContext(request)
    if (request.payload.landBoundaryUploadType) {
      request.yar.set(constants.cacheKeys.LAND_BOUNDARY_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
      const route =
        request.payload.landBoundaryUploadType === constants.landBoundaryUploadTypes.GEOSPATIAL_DATA && process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y'
          ? constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
          : constants.routes.UPLOAD_LAND_BOUNDARY

      return h.redirect(route)
    } else {
      const error = {
        err: [{
          text: 'Select how you want to add the land boundary details for the biodiversity gain site',
          href: '#landBoundaryUploadType'
        }]
      }

      return h.view(constants.views.CHOOSE_LAND_BOUNDARY_UPLOAD, {
        ...context,
        ...error
      })
    }
  }
}

const getContext = request => {
  const landBoundaryUploadType = request.yar.get(constants.cacheKeys.LAND_BOUNDARY_UPLOAD_TYPE)
  const context = { checked }
  if (landBoundaryUploadType) {
    context.landBoundaryUploadType = landBoundaryUploadType
  }
  return context
}

export default [{
  method: 'GET',
  path: constants.routes.CHOOSE_LAND_BOUNDARY_UPLOAD,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHOOSE_LAND_BOUNDARY_UPLOAD,
  handler: handlers.post
}]
