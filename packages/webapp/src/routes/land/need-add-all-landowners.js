import constants from '../../utils/constants.js'
import { getLegalAgreementDocumentType } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreementType = getLegalAgreementDocumentType(
      request.yar.get(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE))?.toLowerCase()
    return h.view(constants.views.NEED_ADD_ALL_LANDOWNERS, { legalAgreementType })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.NEED_ADD_ALL_LANDOWNERS_CHECKED, true)
    const isCombinedCase = (request?._route?.path || '').startsWith('/combined-case')
    const redirectUrl = isCombinedCase ? constants.reusedRoutes.COMBINED_CASE_LANDOWNER_INDIVIDUAL_ORGANISATION : constants.routes.LANDOWNER_INDIVIDUAL_ORGANISATION
    return h.redirect(redirectUrl)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NEED_ADD_ALL_LANDOWNERS,
  handler: handlers.post
}]
