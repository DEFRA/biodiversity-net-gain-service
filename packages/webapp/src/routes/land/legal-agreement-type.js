import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, getContext(request))
  },
  post: async (request, h) => {
    const legalAgreementType = request.payload.legalAgreementType
    if (legalAgreementType) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgreementType)
      return getNextStep(request, h)
    } else {
      return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {
        err: [{
          text: 'Select which type of legal agreement you have',
          href: '#legalAgreementType'
        }],
        ...getContext(request)
      })
    }
  }
}

const getContext = request => {
  return {
    documentType: request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
    types: constants.LEGAL_AGREEMENT_DOCUMENTS
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_AGREEMENT_TYPE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_AGREEMENT_TYPE,
  handler: handlers.post
}]
