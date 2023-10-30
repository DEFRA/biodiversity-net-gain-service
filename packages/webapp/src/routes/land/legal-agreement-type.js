import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Legal information',
      title: 'Add legal agreement details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.LEGAL_AGREEMENT_TYPE
    })
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, getContext(request))
  },
  post: async (request, h) => {
    const legalAgreementType = request.payload.legalAgreementType
    const isLegalAgreementTypeChanged = legalAgreementType !== request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
    if (legalAgreementType) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgreementType)
      if (legalAgreementType !== constants.LEGAL_AGREEMENT_DOCUMENTS[3].id) {
        if (isLegalAgreementTypeChanged) {
          return h.redirect(constants.routes.NEED_ADD_ALL_LEGAL_FILES)
        }
        return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.NEED_ADD_ALL_LEGAL_FILES)
      } else {
        return h.redirect(constants.routes.NEED_LEGAL_AGREEMENT)
      }
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
