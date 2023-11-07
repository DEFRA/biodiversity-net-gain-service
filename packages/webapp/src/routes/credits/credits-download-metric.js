import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../credits/constants.js'
import { logger } from 'defra-logging-facade'

const downloadMetricFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.CREDITS_METRIC_LOCATION)
  console.log('Ajinkya', blobName, constants.BLOB_STORAGE_CONTAINER)
  const config = {
    blobName,
    containerName: constants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.CREDITS_DOWNLOAD_METRIC_FILE,
  handler: downloadMetricFile
}
