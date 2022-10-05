import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const fullName = request.yar.get(constants.redisKeys.FULL_NAME)
    const role = request.yar.get(constants.redisKeys.ROLE_KEY)
    const roleOther = request.yar.get(constants.redisKeys.ROLE_OTHER)

    return h.view(constants.views.CHECK_YOUR_DETAILS, {
      fullName,
      role,
      roleOther
    })
  },
  post: async (request, h) => {
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
