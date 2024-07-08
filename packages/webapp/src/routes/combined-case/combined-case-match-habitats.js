import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.COMBINED_CASE_MATCH_HABITATS,
  handler: async (request, h) => {
    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, {
    })
  }
}
