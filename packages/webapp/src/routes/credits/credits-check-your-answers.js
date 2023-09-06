import constants from '../../credits/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CREDITS_CHECK_YOUR_ANSWERS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_CHECK_YOUR_ANSWERS,
  handler: handlers.get
}]
