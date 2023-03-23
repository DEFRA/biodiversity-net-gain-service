import constants from '../../utils/constants.js'

const handlers = {
  // NOTE: Post method more functionality will come once this page ticket is ready to develope
  get: async (_request, h) => h.view(constants.views.DEVELOPER_TASKLIST)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_TASKLIST,
  handler: handlers.get
}]
