import constants from '../../utils/constants.js'

// const href = '#routing-sold'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_ROUTING_SOLD)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ROUTING_SOLD,
  handler: handlers.get
}]
