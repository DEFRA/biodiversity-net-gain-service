import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.NEED_ADD_ALL_PLANNING_AUTHORITIES, {
      legalAgreementType
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.NEED_ADD_ALL_PLANNING_AUTHORITIES_CHECKED, true)
    return getNextStep(request, h)
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
