import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.ROLE),
  post: async (request, h) => {
    // contact operator for latest 
    return h.redirect(constants.routes.ROLE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ROLE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ROLE,
  handler: handlers.post
}]
