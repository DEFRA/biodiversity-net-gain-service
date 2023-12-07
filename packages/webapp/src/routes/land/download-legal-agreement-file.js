import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import constants from '../../utils/constants.js'
import { validateIdGetSchemaOptional } from '../../utils/helpers.js'
import { logger } from 'defra-logging-facade'

const handlers = {
  get: async (request, h) => {
    const { id } = request.query
    const legalAgreementFiles = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILES)
    const legalAgreementFile = legalAgreementFiles.find(item => item.id === id)
    const blobName = legalAgreementFile.location
    const config = {
      blobName,
      containerName: constants.BLOB_STORAGE_CONTAINER
    }
    const buffer = await blobStorageConnector.downloadToBufferIfExists(logger, config)
    const downloadFilename = legalAgreementFile.location === null ? '' : path.parse(legalAgreementFile.location).base
    return h.response(buffer).header('Content-Disposition', 'attachment; filename= ' + downloadFilename)
  }
}

export default {
  method: 'GET',
  path: constants.routes.DOWNLOAD_LEGAL_AGREEMENT,
  handler: handlers.get,
  options: validateIdGetSchemaOptional
}
