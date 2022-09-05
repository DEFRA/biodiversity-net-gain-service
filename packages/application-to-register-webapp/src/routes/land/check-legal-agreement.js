import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'
import { logger } from 'defra-logging-facade'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    const legalAgreementLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: legalAgreementLocation
      }
      await blobStorageConnector.deleteBlobIfExists(logger, config)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
      return h.view(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, {
        filename: legalAgreementLocation === null ? '' : path.basename(legalAgreementLocation),
        fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
        err: { text: '!TODO: Journey continuation not implemented' }
      })
    } else {
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, { filename: path.basename(legalAgreementLocation), err: { text: 'Select yes if this is the correct file' } })
    }
  }
}

const getContext = async request => {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_LEGAL_AGREEMENT,
  handler: handlers.post
}]
