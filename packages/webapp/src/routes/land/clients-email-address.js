import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CLIENTS_EMAIL_ADDRESS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_EMAIL_ADDRESS,
  handler: handlers.get
}]
