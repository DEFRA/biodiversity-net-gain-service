import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'
import { logger } from 'defra-logging-facade'

// A route to retrieve a geospatial land boundary from Azure blob storage for display on a map.
const downloadLandBoundary = async request => {
  const config = {
    containerName: 'customer-uploads',
    blobName: request.yar.get(constants.redisKeys.GEOSPATIAL_UPLOAD_LOCATION)
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)

  if (buffer) {
    return buffer.toString()
  } else {
    throw new Error('Unable to retrieve land boundary')
  }
}

export default {
  method: 'GET',
  path: constants.routes.GEOSPATIAL_LAND_BOUNDARY,
  handler: downloadLandBoundary
}
