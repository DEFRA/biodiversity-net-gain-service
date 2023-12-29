import constants from '../utils/constants.js'

const start = {
  method: 'GET',
  path: constants.routes.SHUTTER_PAGE,
  options: {
    auth: false
  },
  handler: (request, h) => h.view(constants.views.SHUTTER_PAGE)
}

export default start
