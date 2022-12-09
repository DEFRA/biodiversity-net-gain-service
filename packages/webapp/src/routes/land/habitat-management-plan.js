import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const hmmp = request.yar.get(constants.redisKeys.ELIGIBILITY_HMMP)
    return h.view(constants.views.ELIGIBILITY_HMMP, {
      hmmp,
      checked
    })
  },
  post: async (request, h) => {
    const hmmp = request.payload.hmmp
    if (!hmmp) {
      return h.view(constants.views.ELIGIBILITY_HMMP, {
        checked,
        err: [{
          text: 'Select yes if you have a habitat management and monitoring plan for the biodiversity gain site',
          href: '#hmmp'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_HMMP, hmmp)
    return h.redirect(constants.routes.ELIGIBILITY_RESULTS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_HMMP,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_HMMP,
  handler: handlers.post
}]
