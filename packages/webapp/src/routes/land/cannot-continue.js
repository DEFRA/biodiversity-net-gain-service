import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.ELIGIBILITY_CANNOT_CONTINUE,
  handler: (_request, h) => h.view(constants.views.ELIGIBILITY_CANNOT_CONTINUE)
}
