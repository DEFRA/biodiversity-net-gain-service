import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const boundary = request.yar.get(constants.redisKeys.ELIGIBILITY_BOUNDARY)
    return h.view(constants.views.ELIGIBILITY_BOUNDARY, {
      boundary,
      checked
    })
  },
  post: async (request, h) => {
    const boundary = request.payload.boundary
    if (!boundary) {
      return h.view(constants.views.ELIGIBILITY_BOUNDARY, {
        checked,
        err: [{
          text: 'Select yes if you have a file that shows the boundary of the biodiversity gain site',
          href: '#boundary'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_BOUNDARY, boundary)
    return h.redirect(constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_BOUNDARY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_BOUNDARY,
  handler: handlers.post
}]
