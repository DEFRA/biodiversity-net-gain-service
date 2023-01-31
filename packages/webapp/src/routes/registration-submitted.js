import constants from '../utils/constants.js'
import { formatAppRef } from '../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.REGISTRATION_SUBMITTED, {
      applicationReference: formatAppRef(request.yar.get(constants.redisKeys.APPLICATION_REFERENCE))
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.REGISTRATION_SUBMITTED,
  handler: handlers.get
}]
