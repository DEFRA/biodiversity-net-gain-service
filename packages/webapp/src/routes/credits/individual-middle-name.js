import constants from '../../utils/constants.js'

const individualMiddleName = {
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_MIDDLE_NAME,
  handler: (_request, h) => h.view(constants.views.CREDITS_INDIVIDUAL_MIDDLE_NAME)
}

export default individualMiddleName
