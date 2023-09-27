import constants from '../../utils/constants.js'
import {
  processRegistrationTask, getLegalAgreementDocumentType
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Need responsible bodies'
    }, {
      inProgressUrl: constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES
    })
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.NEED_ADD_ALL_RESPONSIBLE_BODIES, { legalAgreementType })
  },
  post: async (request, h) => {
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.ADD_RESPONSIBLE_BODY_CONVERSATION_CONVENT)
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
