// THIS is just a placeholder route the ticket hasn't come in to sprint yet so is subject to change.
import constants from '../../utils/constants.js'
const handlers = {
  get: async (request, h) => {
    const name = request.yar.get(constants.redisKeys.FULL_NAME)
    return h.view(constants.views.CHECK_OWNERSHIP_DETAILS, { name })
  },
  post: async (_request, h) => h.redirect(constants.routes.REGISTER_LAND_TASK_LIST)
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_OWNERSHIP_DETAILS,
  handler: handlers.post
}]
