import constants from '../../utils/constants.js'
import path from 'path'
import { blobStorageConnector } from '@defra/bng-connectors-lib'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION)
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
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION, 'no')
      return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      context.err = [{
        text: '!TODO: Journey continuation not implemented',
        href: '#check-upload-correct-yes'
      }]
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION, 'yes')
      return h.redirect('/' + constants.views.ADD_LEGAL_AGREEMENT_PARTIES, context)
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
  const choosenOption = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_OPTION)
  let yesSelection, noSelection
  if (choosenOption === 'yes') {
    yesSelection = true
  } else if (choosenOption === 'no') {
    noSelection = true
  }
  return {
    filename: fileLocation === null ? '' : path.parse(fileLocation).base,
    fileSize: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_FILE_SIZE),
    yesSelection,
    noSelection,
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
