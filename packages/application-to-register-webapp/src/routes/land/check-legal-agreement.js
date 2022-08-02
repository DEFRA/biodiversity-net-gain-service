import constants from '../../utils/constants.js'
import path from 'path'

const handlers = {
  get: async (request, h) => {
    const context = await getContext(request)
    return h.view(constants.views.CHECK_LEGAL_AGREEMENT, context)
  },
  post: async (request, h) => {
    const checkLegalAgreement = request.payload.checkLegalAgreement
    request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_CHECKED, checkLegalAgreement)
    if (checkLegalAgreement === 'no') {
      return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
    } else if (checkLegalAgreement === 'yes') {
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, { err: { text: '!TODO: Journey continuation not implemented' } }) // todo add journey continuation
    } else {
      return h.view(constants.views.CHECK_LEGAL_AGREEMENT, { err: { text: 'Select yes if this is the correct file' } })
    }
  }
}

const getContext = async (request) => {
  return {
    filename: path.parse(request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_LOCATION)).base
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
