import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.COMBINED_CASE_CHANGE_REGISTRATION_METRIC)
  },
  post: async (request, h) => {
    // console.log('request', request)
    const changeRegistrationMetric = request.payload.changeRegistrationMetric

    if (changeRegistrationMetric === 'yes') {
      console.log('changeRegistrationMetric YESSSSSS')
      return h.redirect('upload-metric')
    } else {
      console.log('changeRegistrationMetric NOOOOOOO')
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
