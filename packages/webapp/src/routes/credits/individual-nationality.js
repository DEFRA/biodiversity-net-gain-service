import constants from '../../utils/constants.js'

const individualNationality = {
  method: 'GET',
  path: constants.routes.CREDITS_INDIVIDUAL_NATIONALITY,
  handler: (_request, h) => h.view(constants.views.CREDITS_INDIVIDUAL_NATIONALITY)
}

export default individualNationality
