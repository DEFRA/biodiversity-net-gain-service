import constants from '../../credits/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CREDITS_CHECK_YOUR_ANSWERS)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.CREDITS_APPLICATION_REFERENCE, 'BNGCRD-GH67D-A-JK24')
    return h.redirect(constants.routes.CREDITS_CREDITS_CONFIRMATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_CHECK_YOUR_ANSWERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CREDITS_CHECK_YOUR_ANSWERS,
  handler: handlers.post
}]
