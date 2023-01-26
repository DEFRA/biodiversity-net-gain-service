import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CONTINUE_SAVED_REGISTRATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CONTINUE_SAVED_REGISTRATION,
  handler: handlers.get
}]
