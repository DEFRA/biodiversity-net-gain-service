import constants from '../../../utils/constants.js'
import { hideClass } from '../../../utils/helpers.js'
import path from 'path'

const landBoundaryContext = request => {
  const context = {
    hideClass,
    documentOrImage: request.yar.get(constants.redisKeys.LAND_BOUNDARY_UPLOAD_TYPE) === 'documentOrImage'
  }
  const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')

  return {
    ...context,
    landBoundaryUploadType: 'Document or image',
    landBoundaryFileName: getLegalLandBoundaryFileName(request),
    gridReference: request.yar.get(constants.redisKeys.LAND_BOUNDARY_GRID_REFERENCE),
    areaInHectare: (parseFloat(request.yar.get(constants.redisKeys.LAND_BOUNDARY_HECTARES)) || '0') + ' ha',
    checkLandBoundaryLink: isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_CHECK_LAND_BOUNDARY : constants.routes.CHECK_LAND_BOUNDARY
  }
}

const getLegalLandBoundaryFileName = request => {
  const fileLocation = request.yar.get(constants.redisKeys.LAND_BOUNDARY_LOCATION)
  return fileLocation ? path.parse(fileLocation).base : ''
}

export default landBoundaryContext
