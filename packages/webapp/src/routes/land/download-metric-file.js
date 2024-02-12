import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'

const downloadMetricFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  const config = {
    blobName,
    containerName: constants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_METRIC_FILE,
  handler: downloadMetricFile
}
