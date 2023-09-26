import constants from '../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.MANAGE_BIODIVERSITY_GAINS,
  handler: (_request, h) => h.view(constants.views.MANAGE_BIODIVERSITY_GAINS)
}
