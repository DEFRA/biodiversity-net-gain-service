import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'

const href = '#eligibilityMetricYes'
const handlers = {
  get: async (request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_METRIC, {
    ...getContext(request),
    checked
  }),
  post: async (request, h) => {
    const eligibilityMetricValue = request.payload.eligibilityMetricValue
    request.yar.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, eligibilityMetricValue)
    if (!eligibilityMetricValue) {
      return h.view(constants.views.DEVELOPER_ELIGIBILITY_METRIC, {
        ...getContext(request),
        checked,
        err: [
          {
            text: 'You need to select an option',
            href
          }
        ]
      })
    }
    return h.redirect(constants.routes.DEVELOPER_ELIGIBILITY_RESULT)
  }
}

const getContext = request => ({
  selectedOption: request.yar.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)
})

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ELIGIBILITY_METRIC,
  handler: handlers.post
}]
