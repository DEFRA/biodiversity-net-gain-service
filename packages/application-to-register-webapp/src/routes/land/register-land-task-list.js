import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const dataContent = request.yar.get(constants.redisKeys.REGISTRATION_TASK_DETAILS)
    return h.view(constants.views.REGISTER_LAND_TASK_LIST, dataContent)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}]
