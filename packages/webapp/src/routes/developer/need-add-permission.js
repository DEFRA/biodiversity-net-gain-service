import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const writtenAuthorisationProofFiles = request.yar.get(constants.redisKeys.DEVELOPER_WRITTEN_AUTHORISATION_FILES) ?? []
    if (writtenAuthorisationProofFiles.length > 1) { return h.redirect(constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE) }

    return h.view(constants.views.DEVELOPER_NEED_ADD_PERMISSION)
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_NEED_ADD_PERMISSION,
  handler: handlers.get
},
{
  method: 'POST',
  path: constants.routes.DEVELOPER_NEED_ADD_PERMISSION,
  handler: handlers.post
}]
