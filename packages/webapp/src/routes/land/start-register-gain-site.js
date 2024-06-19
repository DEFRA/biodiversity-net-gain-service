import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.START_REGISTER_GAIN_SITE,
  handler: async (request, h) => {
    return h.view(constants.views.START_REGISTER_GAIN_SITE, {
    })
  }
}
