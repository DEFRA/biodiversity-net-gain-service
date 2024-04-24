import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.NEED_ADD_ALL_RESPONSIBLE_BODIES, { legalAgreementType })
  },
  post: async (request, h) => {
    request.yar.set(constants.cacheKeys.NEED_ADD_ALL_RESPONSIBLE_BODIES_CHECKED, true)
    return h.redirect(constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_COVENANT)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES,
  handler: handlers.post
}]
