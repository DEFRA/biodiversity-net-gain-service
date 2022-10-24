import constants from '../../utils/constants.js'
import REGISTER_TASK_LIST from '../../utils/register-task-list.js'

const handlers = {
  get: async (request, h) => {
    let dataContent = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
    if (dataContent === null || dataContent === undefined) {
      dataContent = REGISTER_TASK_LIST
    }
    return h.view(constants.views.REGISTER_LAND_TASK_LIST, dataContent)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
