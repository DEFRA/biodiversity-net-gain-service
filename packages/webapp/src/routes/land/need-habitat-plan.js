import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.NEED_HABITAT_PLAN,
  handler: (_request, h) => h.view(constants.views.NEED_HABITAT_PLAN)
}
