import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_CHECK_ANSWERS)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CHECK_ANSWERS,
  handler: handlers.get
}]
