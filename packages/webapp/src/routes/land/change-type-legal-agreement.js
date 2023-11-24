import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_TYPE_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    const { changeLegalAgreementType } = request.payload

    if (changeLegalAgreementType === 'yes') {
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_FILES)
      request.yar.clear(constants.redisKeys.PLANNING_AUTHORTITY_LIST)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.redisKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO)
      request.yar.clear(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_KEY)
      request.yar.clear(constants.redisKeys.ENHANCEMENT_WORKS_START_DATE_OPTION)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_KEY)
      request.yar.clear(constants.redisKeys.LEGAL_AGREEMENT_END_DATE_OPTION)
    } else {
      return h.redirect(constants.views.CHECK_LEGAL_AGREEMENT_DETAILS)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHANGE_TYPE_LEGAL_AGREEMENT,
  handler: handlers.post
}]
