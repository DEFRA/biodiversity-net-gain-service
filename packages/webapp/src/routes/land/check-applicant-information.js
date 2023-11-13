import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      status: constants.COMPLETE_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CHECK_APPLICANT_INFORMATION
    })
    return h.view(constants.views.CHECK_APPLICANT_INFORMATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.get
}]
