import constants from '../../utils/constants.js'
import { processRegistrationTask, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      inProgressUrl: constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES
    })

    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.NEED_ADD_ALL_PLANNING_AUTHORITIES, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.LEGAL_PARTY_ADD_TYPE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES,
  handler: handlers.post
}]
