import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_APPLICATION_SUBMITTED)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_APPLICATION_SUBMITTED,
  handler: handlers.get
}]
