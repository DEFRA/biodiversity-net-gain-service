import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'
import { logger } from 'defra-logging-facade'

const downloadManagementPlanFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.METRIC_LOCATION)
  const config = {
    blobName,
    containerName: 'trusted'
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_METRIC_FILE,
  handler: downloadManagementPlanFile
}
