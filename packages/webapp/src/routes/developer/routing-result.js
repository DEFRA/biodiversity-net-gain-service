import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ROUTING_RESULT),
  post: async (_request, h) => h.redirect(constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ROUTING_RESULT,
  handler: handlers.get
}]
