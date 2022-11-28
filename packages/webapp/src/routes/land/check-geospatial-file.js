import constants from '../../utils/constants.js'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const handlers = {
  get: async (request, h) => {
    const mapConfig = {
      mapConfig: {
        ...request.yar.get(constants.redisKeys.LAND_BOUNDARY_MAP_CONFIG)
      },
      filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
      fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
    }
    return h.view(constants.views.CHECK_GEOSPATIAL_FILE, mapConfig)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.GEOSPATIAL_UPLOAD_TYPE, request.payload.landBoundaryUploadType)
    let route
    const uploadedGeospatialLandBoundaryLocation = request.yar.get(constants.redisKeys.ORIGINAL_GEOSPATIAL_UPLOAD_LOCATION)
    const geoJsonLandBoundaryLocation = request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION)
    const blobConfig = {
      containerName: 'trusted',
      blobName: geoJsonLandBoundaryLocation
    }
    switch (request.payload.confirmGeospatialLandBoundary) {
      case constants.confirmLandBoundaryOptions.YES:
        route = constants.routes.CHECK_LAND_BOUNDARY_DETAILS
        break
      case constants.confirmLandBoundaryOptions.NO:
        route = constants.routes.UPLOAD_GEOSPATIAL_LAND_BOUNDARY
        // Delete the trusted GeoJSON file from blob storage
        await blobStorageConnector.deleteBlobIfExists(blobConfig)

        if (uploadedGeospatialLandBoundaryLocation) {
          // Delete the trusted version of the non-GeoJSON file updaded by the user.
          blobConfig.blobName = uploadedGeospatialLandBoundaryLocation
          await blobStorageConnector.deleteBlobIfExists(blobConfig)
        }
        break
      default:
        return h.view(constants.views.CHECK_GEOSPATIAL_FILE, {
          err: [{
            text: 'Select yes if this is the correct file',
            href: '#check-upload-correct-yes'
          }],
          filename: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_NAME),
          fileSize: request.yar.get(constants.redisKeys.GEOSPATIAL_FILE_SIZE)
        })
    }
    return h.redirect(route)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_GEOSPATIAL_FILE,
  handler: handlers.post
}]
