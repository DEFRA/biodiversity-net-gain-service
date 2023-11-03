import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UK_ADDRESS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UK_ADDRESS,
  handler: handlers.get
}]
