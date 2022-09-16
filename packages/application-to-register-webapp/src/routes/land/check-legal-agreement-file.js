import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    const context = await getContext(request)
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      // delete the file from blob storage
      const config = {
        containerName: 'trusted',
        blobName: context.fileLocation
      }
      await blobStorageConnector.deleteBlobIfExists(config)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
      return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      context.err = [{
        text: '!TODO: Journey continuation not implemented',
        href: '#check-upload-correct-yes'
      }]
      return h.redirect('/' + constants.views.CHECK_LEGAL_AGREEMENT, context)
    } else {
      context.err = [{
        text: 'Select yes if this is the correct file',
        href: '#check-upload-correct-yes'
      }]
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
    }
  }
}

const getContext = async request => {
  const fileLocation = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
    fileLocation
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
