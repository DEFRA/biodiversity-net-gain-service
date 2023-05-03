import path from 'path'
import constants from '../../utils/constants.js'
import { checkApplicantDetails, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Habitat information',
      title: 'Upload Biodiversity Metric'
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
    processRegistrationTask(request, { taskTitle: 'Habitat information', title: 'Upload Biodiversity Metric' }, { status: constants.COMPLETE_REGISTRATION_TASK_STATUS })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.get,
  config: {
    pre: [checkApplicantDetails]
  }
}, {
  method: 'POST',
  path: constants.routes.CHECK_METRIC_DETAILS,
  handler: handlers.post
}]
