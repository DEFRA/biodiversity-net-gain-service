import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'

const downloadUploadedFile = async (request, h) => {
  const blobName = request.yar.get(constants.redisKeys.DEVELOPER_CONSENT_TO_USE_GAIN_SITE_FILE_LOCATION)
  const config = {
    blobName,
    containerName: 'customer-uploads'
  }
  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DOWNLOAD_CONSENT_TO_USE_GAIN_SITE_FILE,
  handler: downloadUploadedFile
}
