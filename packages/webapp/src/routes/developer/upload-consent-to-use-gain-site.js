import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_UPLOAD_CONSENT_TO_USE_GAIN_SITE,
  handler: handlers.get
}]
