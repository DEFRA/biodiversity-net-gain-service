import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'

const downloadHabitatPlanFile = async (request, h) => {
  const blobName = request.yar.get(constants.cacheKeys.HABITAT_PLAN_LOCATION)
  const config = {
    blobName,
    containerName: 'trusted'
  }
  const buffer = await blobStorageConnector.downloadToBufferIfExists(request.logger, config)
  return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + path.basename(blobName))
}

export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_HABITAT_PLAN_FILE,
  handler: downloadHabitatPlanFile
}
