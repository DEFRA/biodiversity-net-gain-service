import constants from '../../credits/constants.js'
import mainConstants from '../../utils/constants.js'

const getApplicationReference = request => {
  let reference = null
  reference = request.yar.get(constants.redisKeys.CREDITS_APPLICATION_REFERENCE)
  return reference
}

const handlers = {
  get: async (request, h) => {
    const applicationReference = getApplicationReference(request)
    return applicationReference !== null
      ? h.view(constants.views.CREDITS_CREDITS_CONFIRMATION, { applicationReference })
      : h.view(mainConstants.routes.START)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_CREDITS_CONFIRMATION,
  handler: handlers.get
}]
