import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.IS_ADDRESS_UK)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.IS_ADDRESS_UK,
  handler: handlers.get
}]
