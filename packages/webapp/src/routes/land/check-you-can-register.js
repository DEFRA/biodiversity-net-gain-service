import constants from '../../utils/constants.js'
import { processRegistrationTask } from '../../utils/helpers.js'

export default {
  method: 'GET',
  path: constants.routes.ELIGIBILITY_CHECK_YOU_CAN_REGISTER,
  handler: (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Your details',
      title: 'Add your details'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.ELIGIBILITY_CHECK_YOU_CAN_REGISTER
    })
    return h.view(constants.views.ELIGIBILITY_CHECK_YOU_CAN_REGISTER)
  }
}
