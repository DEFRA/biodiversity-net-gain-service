import constants from '../../utils/constants.js'

const handlers = {
  get: async (_, h) => {
    return h.view(constants.views.COMBINED_CASE_CHANGE_REGISTRATION_METRIC)
  },
  post: async (request, h) => {
    const changeRegistrationMetric = request.payload.changeRegistrationMetric

    if (changeRegistrationMetric === 'yes') {
      return h.redirect(constants.reusedRoutes.COMBINED_CASE_UPLOAD_METRIC)
    }
    return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
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
