import constants from '../../utils/constants.js'

export default [{
  method: 'GET',
  path: constants.routes.CREDITS_TASKLIST,
  options: {
    auth: false
  },
  handler: (_req, h) => h.view(constants.views.CREDITS_TASKLIST)
}]
