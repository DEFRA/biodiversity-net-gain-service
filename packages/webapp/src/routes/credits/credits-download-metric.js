import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../credits/constants.js'
import { logger } from '@defra-bng-utils-lib'

const downloadMetricFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.CREDITS_METRIC_LOCATION)
  logger.info('Ajinkya', blobName, constants.BLOB_STORAGE_CONTAINER)
  const config = {
    blobName,
    containerName: constants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.CREDITS_DOWNLOAD_METRIC_FILE,
  handler: downloadMetricFile
}
