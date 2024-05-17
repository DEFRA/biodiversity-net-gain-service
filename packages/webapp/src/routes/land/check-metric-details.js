import path from 'path'
import constants from '../../utils/constants.js'
import { REGISTRATIONCONSTANTS } from '../../journey-validation/registration/task-sections.js'
import { getIndividualTaskStatus } from '../../journey-validation/task-list-generator.js'
const handlers = {
  get: async (request, h) => {
    const registrationTaskStatus = getIndividualTaskStatus(request.yar, REGISTRATIONCONSTANTS.HABITAT_INFO)
    if (registrationTaskStatus !== 'COMPLETED') {
      return h.redirect(getRegistrationOrCombinedTaskListUrl(request.yar))
    }
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    return h.view(constants.views.CHECK_METRIC_DETAILS, {
      filename: path.basename(metricUploadLocation)
    })
  },
  post: async (request, h) => {
    return h.redirect(getRegistrationOrCombinedTaskListUrl(request.yar))
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.post
}]
