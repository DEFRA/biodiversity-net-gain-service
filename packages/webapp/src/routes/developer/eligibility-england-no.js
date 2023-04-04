import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_NO)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_NO,
  handler: handlers.get
}]
