import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const documentType = {
      conservationType: false,
      planningObligationType: false,
      dontHave: false
    }

    const legalAgreementDocumentType = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
    switch (legalAgreementDocumentType) {
      case 'Conservation covenant':
        documentType.conservationType = true
        break
      case 'Planning obligation (section 106 agreement)':
        documentType.planningObligationType = true
        break
      case 'I do not have a legal agreement' :
        documentType.dontHave = true
        break
      default:
        break
    }
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, documentType)
  },
  post: async (request, h) => {
    const legalAgreementType = request.payload.legalAgreementType
    if (legalAgreementType) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgreementType)
      if (legalAgreementType !== 'I do not have a legal agreement') {
        return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.UPLOAD_LEGAL_AGREEMENT)
      } else {
        return h.redirect(constants.routes.NEED_LEGAL_AGREEMENT)
      }
    } else {
      return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {
        err: [{
          text: 'Select which type of legal agreement you have',
          href: '#legalAgreementType'
        }]
      })
    }
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
