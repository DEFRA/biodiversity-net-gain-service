import constants from '../../utils/constants.js'
import { habitatTypeAndConditionMapper, combineHabitats } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    const habitatTypeAndCondition = habitatTypeAndConditionMapper(['d2', 'd3', 'e2', 'e3', 'f2', 'f3'], metricData)
    const combinedHabitatTypeAndCondition = combineHabitats(habitatTypeAndCondition)
    return h.view(constants.views.CHECK_HABITAT_CREATED, {
      combinedHabitatTypeAndCondition
    })
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.METRIC_HABITAT_CREATED_CHECKED, true)
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_METRIC_DETAILS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_HABITAT_CREATED,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_HABITAT_CREATED,
  handler: handlers.post
}]
