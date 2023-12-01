import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Land information',
      title: 'Add land ownership details'
    }, {
      inProgressUrl: constants.routes.LANDOWNER_CONSENT
    })
    const name = getName(request.auth.credentials.account)
    return h.view(constants.views.LANDOWNER_CONSENT, { name })
  },
  post: async (request, h) => {
    const consent = request.payload.landownerConsent
    const name = getName(request.auth.credentials.account)
    if (!consent) {
      return h.view(constants.views.LANDOWNER_CONSENT, {
        name,
        err: [{
          text: 'Agree to the landowner consent declaration to continue',
          href: '#landownerConsent'
        }]
      })
    } else {
      request.yar.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, consent)
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.LAND_OWNERSHIP_PROOF_LIST)
    }
  }
}

const getName = account => `${account.idTokenClaims.firstName} ${account.idTokenClaims.lastName}`

export default [{
  method: 'GET',
  path: constants.routes.LANDOWNER_CONSENT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LANDOWNER_CONSENT,
  handler: handlers.post
}]
