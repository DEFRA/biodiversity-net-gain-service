import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, getContext(request))
  },
  post: async (request, h) => {
    const legalAgreementType = request.payload.legalAgreementType
    if (legalAgreementType) {
      request.yar.set(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgreementType)
      if (legalAgreementType !== constants.LEGAL_AGREEMENT_DOCUMENTS[3].id) {
        return h.redirect(request.yar.get(constants.cacheKeys.REFERER, true) || constants.routes.NEED_ADD_ALL_LEGAL_FILES)
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
    documentType: request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE),
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
