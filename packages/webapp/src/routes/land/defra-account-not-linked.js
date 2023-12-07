import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEFRA_ACCOUNT_NOT_LINKED)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEFRA_ACCOUNT_NOT_LINKED,
  handler: handlers.get
}]
