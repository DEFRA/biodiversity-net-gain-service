import constants from '../utils/constants.js'

const handlers = {
  get: async (request, h) => {
   return h.view(constants.views.CONFIRMATION, {
    gainSiteReference: request.yar.get(constants.redisKeys.GAIN_SITE_REFERENCE)
   })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CONFIRMATION,
  handler: handlers.get
}]
