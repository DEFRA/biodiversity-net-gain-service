import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.get
}]
