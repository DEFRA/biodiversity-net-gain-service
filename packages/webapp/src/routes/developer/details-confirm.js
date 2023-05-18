import constants from '../../utils/constants.js'
import { processDeveloperTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const fullName = request.yar.get(constants.redisKeys.DEVELOPER_FULL_NAME)
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_CONFIRM, {
      fullName,
      emailAddress
    })
  },
  // NOTE: Here needs to add more code for task progress status once tasklist ticket is ready develope
  post: async (_request, h) => {
    processDeveloperTask(_request, { taskTitle: 'Your details', title: 'Add your details' }, { status: constants.COMPLETE_DEVELOPER_TASK_STATUS })
    return h.redirect(constants.routes.DEVELOPER_TASKLIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DETAILS_CONFIRM,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_DETAILS_CONFIRM,
  handler: handlers.post
}]
