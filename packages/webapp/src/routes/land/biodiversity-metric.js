import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const metric = request.yar.get(constants.redisKeys.ELIGIBILITY_BIODIVERSITY_METRIC)
    return h.view(constants.views.ELIGIBILITY_BIODIVERSITY_METRIC, {
      metric,
      checked
    })
  },
  post: async (request, h) => {
    const metric = request.payload.metric
    if (!metric) {
      return h.view(constants.views.ELIGIBILITY_BIODIVERSITY_METRIC, {
        checked,
        err: [{
          text: 'Select yes if you have a completed Biodiversity Metric 4.0 for the biodiversity gain site',
          href: '#metric'
        }]
      })
    }
    request.yar.set(constants.redisKeys.ELIGIBILITY_BIODIVERSITY_METRIC, metric)
    return h.redirect(constants.routes.ELIGIBILITY_HMMP)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC,
  handler: handlers.post
}]
