import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_TASKLIST)
  }
  // NOTE: Post method will come once this page ticket is ready to develope
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_TASKLIST,
  handler: handlers.get
}]
