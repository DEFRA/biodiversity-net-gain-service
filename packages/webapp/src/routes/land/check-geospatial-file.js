import constants from '../../utils/constants.js'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'
import { deleteBlobFromContainers } from '../../utils/azure-storage.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land boundary details'
    }, {
      inProgressUrl: constants.routes.CHECK_GEOSPATIAL_FILE
    })
    const fileSize = request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
    const humanReadableFileSize = parseFloat(parseFloat(fileSize / 1024 / 1024).toFixed(4))
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      },
      filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
      fileSize,
      humanReadableFileSize
    }
    return h.view(constants.views.CHECK_GEOSPATIAL_FILE, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route
    const uploadedGeospatialLandBoundaryLocation = request.yar.get(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION)
    const geoJsonLandBoundaryLocation = request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION)
    const reprojectedGeoJsonLandBoundaryLocation = request.yar.get(constants.redisKeys.REPROJECTED_GEOSPATIAL_UPLOAD_LOCATION)

    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        route = request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_LAND_BOUNDARY_DETAILS
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        await deleteBlobFromContainers(geoJsonLandBoundaryLocation)
        await deleteBlobFromContainers(uploadedGeospatialLandBoundaryLocation)
        await deleteBlobFromContainers(reprojectedGeoJsonLandBoundaryLocation)
        break
      default:
        return h.view(constants.views.CHECK_GEOSPATIAL_FILE, {
          err: [{
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          }],
          filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
          fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE),
          humanReadableFileSize: parseFloat(parseFloat(request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE) / 1024 / 1024).toFixed(4))
        })
    }
    return h.redirect(route)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.post
}]
