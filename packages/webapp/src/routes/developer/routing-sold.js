import constants from '../../utils/constants.js'

// Note: Temporary added to display page just for visualization on submitting prev page form, more functionality will cover in next PR
const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ROUTING_SOLD)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ROUTING_SOLD,
  handler: handlers.get
}]
