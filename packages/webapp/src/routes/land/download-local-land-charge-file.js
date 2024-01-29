import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'

const downloadLocalLandChargeFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.LOCAL_LAND_CHARGE_LOCATION)
  const config = {
    blobName,
    containerName: constants.BLOB_STORAGE_CONTAINER
  }

  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_LOCAL_LAND_CHARGE_FILE,
  handler: downloadLocalLandChargeFile
}
