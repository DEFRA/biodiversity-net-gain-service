import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const consent = request.yar.get(constants.redisKeys.ELIGIBILITY_CONSENT)
    return h.view(constants.views.ELIGIBILITY_CONSENT, {
      consent,
      checked
    })
  },
  post: async (request, h) => {
    const consent = request.payload.consent
    if (!consent) {
      return h.view(constants.views.ELIGIBILITY_CONSENT, {
        checked,
        err: [{
          text: 'Select yes if you have consent to register the biodiversity gain site',
          href: '#consent'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_CONSENT, consent)
    return h.redirect(constants.routes.ELIGIBILITY_LEGAL_AGREEMENT)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_CONSENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_CONSENT,
  handler: handlers.post
}]
