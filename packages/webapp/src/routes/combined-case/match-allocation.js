import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.COMBINED_CASE_MATCH_AVAILABLE_HABITATS)
  },
  post: async (request, h) => {
    request.yar.set(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE, true)
    return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_MATCH_AVAILABLE_HABITATS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.COMBINED_CASE_MATCH_AVAILABLE_HABITATS,
  handler: handlers.post
}]
