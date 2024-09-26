import constants from '../../../utils/constants.js'
import { hideClass } from '../../../utils/helpers.js'
import path from 'path'

const geospatialOrLandBoundaryContext = request => {
  const context = {
    hideClass,
    geospatial: request.yar.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'geospatialData',
    documentOrImage: request.yar.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'documentOrImage'
  }
  const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
  if (context.geospatial && process.env.ENABLE_ROUTE_SUPPORT_FOR_GEOSPATIAL === 'Y') {
    return {
      ...context,
      mapConfig: request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG),
      landBoundaryUploadType: 'Geospatial file',
      landBoundaryFileName: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
      gridReference: request.yar.get(constants.redisKeys.GEOSPATIAL_GRID_REFERENCE),
      areaInHectare: `${request.yar.get(constants.redisKeys.GEOSPATIAL_HECTARES)} ha`,
      checkLandBoundaryLink: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_GEOSPATIAL_FILE : constants.routes.CHECK_GEOSPATIAL_FILE
    }
  } else {
    return {
      ...context,
      landBoundaryUploadType: 'Document or image',
      landBoundaryFileName: getLegalLandBoundaryFileName(request),
      gridReference: request.yar.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE),
      areaInHectare: (parseFloat(request.yar.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)) || '0') + ' ha',
      checkLandBoundaryLink: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY : constants.routes.CHECK_LAND_BOUNDARY
    }
  }
}

const getLegalLandBoundaryFileName = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
  return fileLocation ? path.parse(fileLocation).base : ''
}

export default geospatialOrLandBoundaryContext