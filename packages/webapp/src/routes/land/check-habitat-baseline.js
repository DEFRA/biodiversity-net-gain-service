import constants from '../../utils/constants.js'
import { getValidReferrerUrl, checked, habitatTypeAndConditionMapper } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    const habitatTypeAndCondition = habitatTypeAndConditionMapper(['d1', 'e1', 'f1'], metricData)
    return h.view(constants.views.CHECK_HABITAT_BASELINE, {
      habitatTypeAndCondition,
      checked
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.METRIC_HABITAT_BASELINE_CHECKED, true)
    const referrerUrl = getValidReferrerUrl(request.yar, constants.LAND_METRIC_VALID_REFERRERS)
    return h.redirect(referrerUrl || constants.routes.CHECK_HABITAT_CREATED)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_HABITAT_BASELINE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_HABITAT_BASELINE,
  handler: handlers.post
}]
