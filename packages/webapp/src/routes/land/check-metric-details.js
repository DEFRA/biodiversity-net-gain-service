import path from 'path'
import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Add habitat baseline, creation and enhancements'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_METRIC_DETAILS
    })
    const metricUploadLocation = request.yar.get(constants.redisKeys.METRIC_LOCATION)
    return h.view(constants.views.CHECK_METRIC_DETAILS, {
      filename: path.basename(metricUploadLocation)
    })
  },
  post: async (request, h) => {
    processRegistrationTask(request, { taskTitle: 'Habitat information', title: 'Add habitat baseline, creation and enhancements' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
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
