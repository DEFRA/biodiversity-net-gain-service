import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.BIODIVERSITY_GAIN_SITES,
  handler: (_request, h) => h.view(constants.views.BIODIVERSITY_GAIN_SITES)
}
