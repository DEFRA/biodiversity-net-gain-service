import constants from '../../utils/constants.js'

const getApplicationReference = request => {
  let reference = null
  reference = request.yar.get(constants.redisKeys.CREDITS_PURCHASE_APPLICATION_REFERENCE)
  return reference
}

const handlers = {
  get: async (request, h) => {
    const applicationReference = getApplicationReference(request)
    return applicationReference !== null
      ? h.view(constants.views.CREDITS_PURCHASE_CONFIRMATION, { applicationReference })
      : h.view(constants.views.MANAGE_BIODIVERSITY_GAINS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_PURCHASE_CONFIRMATION,
  handler: handlers.get
}]
