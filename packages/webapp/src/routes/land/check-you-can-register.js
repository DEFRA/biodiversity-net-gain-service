import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.ELIGIBILITY_CHECK_YOU_CAN_REGISTER,
  handler: (_request, h) => h.view(constants.views.ELIGIBILITY_CHECK_YOU_CAN_REGISTER)
}
