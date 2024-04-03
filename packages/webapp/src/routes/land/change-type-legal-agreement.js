import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => {
    return h.view(constants.views.CHANGE_TYPE_LEGAL_AGREEMENT)
  },
  post: async (request, h) => {
    const { changeLegalAgreementType } = request.payload

    if (changeLegalAgreementType === 'yes') {
      request.yar.clear(constants.cacheKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE)
      request.yar.clear(constants.cacheKeys.LEGAL_AGREEMENT_FILES)
      request.yar.clear(constants.cacheKeys.PLANNING_AUTHORTITY_LIST)
      request.yar.clear(constants.cacheKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.cacheKeys.LEGAL_AGREEMENT_LANDOWNER_CONSERVATION_CONVENANTS)
      request.yar.clear(constants.cacheKeys.HABITAT_PLAN_LEGAL_AGREEMENT_DOCUMENT_INCLUDED_YES_NO)
      request.yar.clear(constants.cacheKeys.ENHANCEMENT_WORKS_START_DATE_KEY)
      request.yar.clear(constants.cacheKeys.ENHANCEMENT_WORKS_START_DATE_OPTION)
      request.yar.clear(constants.cacheKeys.HABITAT_ENHANCEMENTS_END_DATE_KEY)
      request.yar.clear(constants.cacheKeys.HABITAT_ENHANCEMENTS_END_DATE_OPTION)
      request.yar.clear(constants.cacheKeys.LEGAL_AGREEMENT_RESPONSIBLE_BODIES)
      request.yar.clear(constants.cacheKeys.REFERER)

      return h.redirect(constants.routes.LEGAL_AGREEMENT_TYPE)
    } else if (changeLegalAgreementType === 'no') {
      return h.redirect(constants.routes.CHECK_LEGAL_AGREEMENT_DETAILS)
    } else {
      return h.view(constants.views.CHANGE_TYPE_LEGAL_AGREEMENT, {
        err: [{
          text: 'Select yes if you want to change the type of legal agreement',
          href: '#changeLegalTypeAgreement'
        }]
      })
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
