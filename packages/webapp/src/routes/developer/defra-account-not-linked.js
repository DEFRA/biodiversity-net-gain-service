import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DEFRA_ACCOUNT_NOT_LINKED,
  handler: handlers.get
}]
