import constants from '../../utils/constants.js'
import { getReferrer, setReferrer } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const documentType = {
      conservationType: false,
      planningObligationType: false,
      dontHave: false
    }

    setReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY)
    const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY, false)
    if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
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
    }
    return h.view(constants.views.LEGAL_AGREEMENT_TYPE, documentType)
  },
  post: async (request, h) => {
    const legalAgreementType = request.payload.legalAgreementType
    if (legalAgreementType !== undefined) {
      request.yar.set(constants.redisKeys.LEGAL_AGREEMENT_DOCUMENT_TYPE, legalAgreementType)
      if (legalAgreementType !== 'I do not have a legal agreement') {
        const referredFrom = getReferrer(request, constants.redisKeys.LEGAL_AGREEMENT_PARTIES_KEY, true)
        if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
          return h.redirect(`/${constants.views.LEGAL_AGREEMENT_SUMMARY}`)
        }
        return h.redirect(constants.routes.UPLOAD_LEGAL_AGREEMENT)
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
