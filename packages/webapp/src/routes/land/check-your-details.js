import constants from '../../utils/constants.js'
import { processCompletedRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const fullName = request.yar.get(constants.redisKeys.FULL_NAME)
    const role = request.yar.get(constants.redisKeys.ROLE_KEY)
    const roleOther = request.yar.get(constants.redisKeys.ROLE_OTHER)
    const emailAddress = request.yar.get(constants.redisKeys.EMAIL_VALUE)
    return h.view(constants.views.CHECK_YOUR_DETAILS, {
      fullName,
      role,
      roleOther,
      emailAddress
    })
  },
  post: async (request, h) => {
    processCompletedRegistrationTask(request, { taskTitle: 'Your details', title: 'Add your details' })
    return h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_YOUR_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_YOUR_DETAILS,
  handler: handlers.post
}]
