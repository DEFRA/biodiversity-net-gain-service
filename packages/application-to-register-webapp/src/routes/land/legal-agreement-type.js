import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE)
  },
  post: async (request, h) => {
    const legalAgrementType = request.payload.legalAgrementType
    if (legalAgrementType !== undefined) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgrementType)
      if (legalAgrementType !== 'I do not have a legal agreement') {
        return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
      } else if (legalAgrementType === 'I do not have a legal agreement') {
        return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {})
      } else {
        return h.view(constants.views.LEGAL_AGREEMENT_TYPE, {
          err: [{
            text: 'Select which type of legal agreement you have',
            href: '#legalAgrementType'
          }]
        })
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
