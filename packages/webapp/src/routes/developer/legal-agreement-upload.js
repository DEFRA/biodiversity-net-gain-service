import constants from '../../utils/constants.js'
const handlers = {
  get: async (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_LEGAL_AGREEMENT_UPLOAD, context)
  },
  post: async (request, h) => {
    return h.view(constants.views.DEVELOPER_LEGAL_AGREEMENT_UPLOAD, {
      ...getContext(request)
    })
  }
}

const getContext = request => request.yar.get(constants.redisKeys.DEVELOPER_METRIC_LOCATION)

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_LEGAL_AGREEMENT_UPLOAD,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_LEGAL_AGREEMENT_UPLOAD,
  handler: handlers.post
}]
