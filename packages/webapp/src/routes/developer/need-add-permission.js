import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_NEED_ADD_PERMISSION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_NEED_ADD_PERMISSION,
  handler: handlers.get
}]
