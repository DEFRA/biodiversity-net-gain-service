import constants from '../../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_APPLICANT_CONFIRM,
  handler: (_request, h) => h.view(constants.views.CREDITS_APPLICANT_CONFIRM)
}]
