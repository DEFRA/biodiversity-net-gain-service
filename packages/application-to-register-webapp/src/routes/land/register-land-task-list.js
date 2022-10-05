import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.REGISTER_LAND_TASK_LIST),
  post: async (request, h) => h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.REGISTER_LAND_TASK_LIST,
  handler: handlers.post
}]
