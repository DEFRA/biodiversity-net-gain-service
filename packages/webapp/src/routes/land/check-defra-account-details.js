import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CHECK_DEFRA_ACCOUNT_DETAILS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS,
  handler: handlers.get
}]
