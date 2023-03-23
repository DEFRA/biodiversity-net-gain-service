import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const fullName = request.yar.get(constants.redisKeys.DEVELOPER_FULL_NAME)
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_CONFIRM, {
      fullName,
      emailAddress
    })
  },
  post: async (request, h) => {
    // NOTE: Here needs to add more code for task progress status once tasklist ticket is ready develope
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
