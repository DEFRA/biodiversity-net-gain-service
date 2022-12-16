import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const legalAgreement = request.yar.get(constants.redisKeys.ELIGIBILITY_LEGAL_AGREEMENT)
    return h.view(constants.views.ELIGIBILITY_LEGAL_AGREEMENT, {
      legalAgreement,
      checked
    })
  },
  post: async (request, h) => {
    const legalAgreement = request.payload.legalAgreement
    if (!legalAgreement) {
      return h.view(constants.views.ELIGIBILITY_LEGAL_AGREEMENT, {
        checked,
        err: [{
          text: 'Select yes if you have a legal agreement securing the biodiversity gain site',
          href: '#legalAgreement'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_LEGAL_AGREEMENT, legalAgreement)
    return h.redirect(constants.routes.ELIGIBILITY_OWNERSHIP_PROOF)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_LEGAL_AGREEMENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_LEGAL_AGREEMENT,
  handler: handlers.post
}]
