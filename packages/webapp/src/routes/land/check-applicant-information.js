import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'
import applicationInformationContext from './helpers/applicant-information.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CHECK_APPLICANT_INFORMATION
    })
    return h.view(constants.views.CHECK_APPLICANT_INFORMATION, applicationInformationContext(request.yar))
  },
  post: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      status: constants.COMPLETE_REGISTRATION_TASK_STATUS
    })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_APPLICANT_INFORMATION,
  handler: handlers.post
}]
