import constants from '../../utils/constants.js'
import { checked, getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementAddType = request.yar.get(constants.redisKeys.LEGAL_PARTY_ADD_TYPE)
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.LEGAL_PARTY_ADD_TYPE, { legalAgreementAddType, legalAgreementType })
  },
  post: async (request, h) => {
    const { legalAgreementAddType } = request.payload

    if (!legalAgreementAddType) {
      return h.view(constants.views.LEGAL_PARTY_ADD_TYPE, {
        checked,
        err: [{
          text: 'Select legal party type securing the biodiversity gain site',
          href: '#landownerType'
        }]
      })
    }
    request.yar.set(constants.redisKeys.LEGAL_PARTY_ADD_TYPE, legalAgreementAddType)

    if (legalAgreementAddType === 'individual') {
      return h.redirect(constants.routes.ADD_LANDOWNER_INDIVIDUAL)
    }

    if (legalAgreementAddType === 'organisation') {
      return h.redirect(constants.routes.ADD_LANDOWNER_ORGANISATION)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.LEGAL_PARTY_ADD_TYPE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LEGAL_PARTY_ADD_TYPE,
  handler: handlers.post
}]
