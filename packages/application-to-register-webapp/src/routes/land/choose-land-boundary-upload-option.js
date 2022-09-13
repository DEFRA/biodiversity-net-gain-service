import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHOOSE_GEOSPATIAL_UPLOAD, {
      ...context
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    const route =
      request.payload.landBoundaryUploadType === constants.landBoundaryUploadTypes.GEOSPATIAL_DATA
        ? constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        : constants.routes.UPLOAD_LAND_BOUNDARY_DOCUMENT

    // TO DO - Remove temporary land boundary document route handling when corresponding functionality is
    // available.
    if (route === constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY) {
      return h.redirect(route)
    } else {
      return h.view('404').code(404)
    }
  }
}

const getContext = async request => {
  const landBoundaryUploadType = request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE)
  let context
  if (landBoundaryUploadType) {
    context = {
      landBoundaryUploadType
    }
  }
  return context
}

export default [{
  method: 'GET',
  path: constants.routes.CHOOSE_GEOSPATIAL_UPLOAD,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHOOSE_GEOSPATIAL_UPLOAD,
  handler: handlers.post
}]
