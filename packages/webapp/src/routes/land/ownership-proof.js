import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const landOwnership = request.yar.get(constants.redisKeys.ELIGIBILITY_OWNERSHIP_PROOF)
    return h.view(constants.views.ELIGIBILITY_OWNERSHIP_PROOF, {
      landOwnership,
      checked
    })
  },
  post: async (request, h) => {
    const landOwnership = request.payload.landOwnership
    if (!landOwnership) {
      return h.view(constants.views.ELIGIBILITY_OWNERSHIP_PROOF, {
        checked,
        err: [{
          text: 'Select yes if you have proof of ownership for the land',
          href: '#landOwnership'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_OWNERSHIP_PROOF, landOwnership)
    return h.redirect(constants.routes.ELIGIBILITY_BOUNDARY)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_OWNERSHIP_PROOF,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_OWNERSHIP_PROOF,
  handler: handlers.post
}]
