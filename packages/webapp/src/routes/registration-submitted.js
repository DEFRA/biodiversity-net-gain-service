import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const applicationReference = request.yar.get(constants.redisKeys.APPLICATION_REFERENCE)
    // Reset user session as submitted
    request.yar.reset()
    return h.view(constants.views.REGISTRATION_SUBMITTED, {
      applicationReference
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTRATION_SUBMITTED,
  handler: handlers.get
}]
