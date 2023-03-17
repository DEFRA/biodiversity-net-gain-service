import constants from '../../utils/constants.js'

// const href = '#routing-result'
const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_ROUTING_RESULT)
  },
  post: async (request, h) => {
    return h.redirect('#')
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ROUTING_RESULT,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ROUTING_RESULT,
  handler: handlers.post
}]
