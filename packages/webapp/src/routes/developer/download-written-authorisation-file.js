import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'
import { logger } from '@defra/bng-utils-lib'

const downloadFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_LOCATION)
  const config = {
    blobName,
    containerName: constants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DOWNLOAD_WRITTEN_AUTHORISATION,
  handler: downloadFile
}
