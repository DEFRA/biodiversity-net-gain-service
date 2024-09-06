import constants from '../../utils/constants.js'

const handlers = {
  get: async (_, h) => {
    return h.view(constants.views.COMBINED_CASE_CHANGE_REGISTRATION_METRIC)
  },
  post: async (_, h) => {
    return h.view(constants.views.COMBINED_CASE_CHANGE_REGISTRATION_METRIC)
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
