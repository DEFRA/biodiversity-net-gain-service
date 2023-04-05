import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_METRIC)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_METRIC,
  handler: handlers.get
}]
