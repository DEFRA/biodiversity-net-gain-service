import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import creditsPurchaseConstants from '../../utils/credits-purchase-constants.js'

const downloadMetricFile = async (request, h) => {
  const blobName = request.yar.get(creditsPurchaseConstants.redisKeys.CREDITS_METRIC_LOCATION)
  const config = {
    blobName,
    containerName: creditsPurchaseConstants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: creditsPurchaseConstants.routes.CREDITS_DOWNLOAD_METRIC_FILE,
  handler: downloadMetricFile
}
