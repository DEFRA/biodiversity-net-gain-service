import constants from '../utils/constants.js'

const start = {
  method: 'GET',
  path: constants.routes.START,
  handler: (_request, h) => h.view(constants.views.START)
}

export default start
