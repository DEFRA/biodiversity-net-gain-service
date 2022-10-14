import constants from '../../utils/constants.js'
let referredFrom
const handlers = {
  get: async (request, h) => {
    referredFrom = request.info.referrer
    const legalAgreementDocumentType = request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
    const documentType = {
      conservationType: false,
      planningObligationType: false,
      dontHave: false
    }
    switch (legalAgreementDocumentType) {
      case 'Conservation covenant':
        documentType.conservationType = true
        break
      case 'Planning obligation (section 106 agreement)':
        documentType.planningObligationType = true
        break
      default :
        documentType.dontHave = true
        break
    }
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, documentType)
  },
  post: async (request, h) => {
    const legalAgrementType = request.payload.legalAgrementType
    if (legalAgrementType !== undefined) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgrementType)
      if (legalAgrementType !== 'I do not have a legal agreement') {
        if (referredFrom) {
          return h.redirect(`/${constants.views.LEGAL_AGREEMENT_SUMMARY}`)
        }
        return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
      } else {
        return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {})
      }
    } else {
      return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {
        err: [{
          text: 'Select which type of legal agreement you have',
          href: '#legalAgrementType'
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
