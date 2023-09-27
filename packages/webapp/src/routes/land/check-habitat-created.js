import constants from '../../utils/constants.js'
import { processRegistrationTask, habitatTypeAndConditionMapper, combineHabitats } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat baseline, creation and enhancements'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_HABITAT_CREATED
    })
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    const habitatTypeAndCondition = habitatTypeAndConditionMapper(['d2', 'd3', 'e2', 'e3', 'f2', 'f3'], metricData)
    const combinedHabitatTypeAndCondition = combineHabitats(habitatTypeAndCondition)
    return h.view(constants.views.CHECK_HABITAT_CREATED, {
      combinedHabitatTypeAndCondition
    })
  },
  post: async (request, h) => h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_METRIC_DETAILS)
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
