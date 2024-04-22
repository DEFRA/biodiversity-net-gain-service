import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT, { legalAgreementType })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.NEED_ADD_ALL_LANDOWNERS_CHECKED, true)
    return h.redirect(constants.routes.LANDOWNER_CONSERVATION_COVENANT_INDIVIDUAL_ORGANISATION)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS_CONSERVATION_COVENANT,
  handler: handlers.post
}]
