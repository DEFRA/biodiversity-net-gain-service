import constants from '../../utils/constants.js'

const href = '#routingRegister'
const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_ROUTING_REGISTER),
  post: async (request, h) => {
    const routingRegisterOption = request.payload.routingRegisterOption
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, routingRegisterOption)
    if (routingRegisterOption === constants.ROUTING_REGISTER_OPTIONS.REGISTER) {
      return h.redirect(constants.routes.DEVELOPER_ROUTING_SOLD)
    } else if (routingRegisterOption === constants.ROUTING_REGISTER_OPTIONS.RECORD) {
      return h.redirect('/' + constants.views.DEVELOPER_ROUTING_RESULT)
    }
    return h.view(constants.views.DEVELOPER_ROUTING_REGISTER, {
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
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_ROUTING_REGISTER,
  handler: handlers.post
}]
