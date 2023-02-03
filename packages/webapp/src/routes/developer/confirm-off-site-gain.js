import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    const context = getContext(request)
    return h.view(constants.views.DEVELOPER_CONFIRM_OFF_SITE_GAIN, context)
  },
  post: async (request, h) => {
    const confirmOffsiteGain = request.payload.confirmOffsiteGain
    request.yar.set(constants.redisKeys.METRIC_FILE_CHECKED, confirmOffsiteGain)
  }
}

const getContext = request => request.yar.get(constants.redisKeys.DEVELOPER_METRIC_DATA)

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CONFIRM_OFF_SITE_GAIN,
  handler: handlers.post
}]
