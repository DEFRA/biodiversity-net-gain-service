import constants from '../../utils/constants.js'
import { processRegistrationTask, checked, habitatTypeAndConditionMapper, checkApplicantDetails } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Upload Biodiversity Metric'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_HABITAT_BASELINE
    })
    const metricData = request.yar.get(constants.redisKeys.METRIC_DATA)
    const habitatTypeAndCondition = habitatTypeAndConditionMapper(['d1', 'e1', 'f1'], metricData)
    return h.view(constants.views.CHECK_HABITAT_BASELINE, {
      habitatTypeAndCondition,
      checked
    })
  },
  post: async (request, h) => h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_HABITAT_CREATED)
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_HABITAT_BASELINE,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_HABITAT_BASELINE,
  handler: handlers.post
}]
