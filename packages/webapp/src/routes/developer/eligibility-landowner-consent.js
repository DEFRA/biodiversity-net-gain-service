import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ELIGIBILITY_LO_CONSENT)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_LO_CONSENT,
  handler: handlers.get
}]
