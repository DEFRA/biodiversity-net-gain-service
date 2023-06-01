import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.APPLICATION_REFERENCE)
    return h.view(constants.views.DEVELOPER_CONFIRM, {
      applicationReference
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM,
  handler: handlers.get
}]
