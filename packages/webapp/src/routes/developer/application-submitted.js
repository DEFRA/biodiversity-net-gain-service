import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.DEVELOPER_APP_REFERENCE)
    request.yar.reset()
    return h.view(constants.views.DEVELOPER_CONFIRMATION, { applicationReference })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRMATION,
  handler: handlers.get
}]
