import constants from '../../utils/constants.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

const href = '#record-off-site'
const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ROUTING_REGISTER),
  post: async (request, h) => {
    const routingRegisterOption = request.payload.routingRegisterOption
    if (routingRegisterOption === constants.ROUTING_REGISTER_OPTIONS.REGISTER) {
      return h.redirect(constants.routes.DEVELOPER_ROUTING_SOLD)
    } else if (routingRegisterOption === constants.ROUTING_REGISTER_OPTIONS.RECORD) {
      return h.redirect(constants.routes.DEVELOPER_ROUTING_RESULT)
    }
    return h.redirectView(constants.views.DEVELOPER_ROUTING_REGISTER, {
      err: [
        {
          text: 'You need to select an option',
          href
        }
      ]
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ROUTING_REGISTER,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ROUTING_REGISTER,
  handler: addRedirectViewUsed(handlers.post)
}]
