import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.DEVELOPER_APPLICATION_SUBMITTED, {
      applicationReference
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_APPLICATION_SUBMITTED,
  handler: handlers.get
}]
