import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_PLANNING_DECISION_UPLOAD)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_PLANNING_DECISION_UPLOAD,
  handler: handlers.get
}
]
