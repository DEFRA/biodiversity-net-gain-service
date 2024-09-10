import constants from '../../utils/constants.js'

const handlers = {
  get: async (_, h) => {
    return h.view(constants.views.COMBINED_CASE_CHANGE_REGISTRATION_METRIC)
  },
  post: async (request, h) => {
    // console.log('request', request)
    const changeRegistrationMetric = request.payload.changeRegistrationMetric

    if (changeRegistrationMetric === 'yes') {
      // clear registration metric data
      //      registration metric data will be removed by upload-metric.js
      // clear developer metric data
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_LOCATION)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_SIZE)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_TYPE)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_DATA)
      request.yar.clear(constants.redisKeys.DEVELOPER_METRIC_FILE_NAME)

      // clear matching data
      request.yar.clear(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
      request.yar.clear(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)

      return h.redirect('upload-metric')
    } else {
      return h.redirect('tasklist')
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_CHANGE_REGISTRATION_METRIC,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.COMBINED_CASE_CHANGE_REGISTRATION_METRIC,
  handler: handlers.post
}]
