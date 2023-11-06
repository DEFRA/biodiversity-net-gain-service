import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CLIENTS_PHONE_NUMBER)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_PHONE_NUMBER,
  handler: handlers.get
}]
