import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()

    return h.view(constants.views.NEED_ADD_ALL_LEGAL_FILES, { legalAgreementType })
  },
  post: async (request, h) => {
    request.yar.set(constants.cacheKeys.NEED_ADD_ALL_LEGAL_FILES_CHECKED, true)
    return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_LEGAL_FILES,
  handler: handlers.post
}]
