import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.UPLOAD_WRITTEN_AUTHORISATION)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UPLOAD_WRITTEN_AUTHORISATION,
  handler: handlers.get
}]
