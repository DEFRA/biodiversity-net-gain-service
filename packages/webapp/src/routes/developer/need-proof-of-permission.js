import constants from '../../utils/constants.js'
import getDeveloperClientContext from '../../utils/get-developer-client-context.js'

const handlers = {
  get: async (request, h) => {
    const context = getDeveloperClientContext(request.yar)
    return h.view(constants.views.DEVELOPER_NEED_PROOF_OF_PERMISSION, context)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.DEVELOPER_PROOF_OF_PERMISSION_SEEN, true)
    return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_NEED_PROOF_OF_PERMISSION,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_NEED_PROOF_OF_PERMISSION,
  handler: handlers.post
}]
