import constants from '../utils/constants.js'

const home = {
  method: 'GET',
  path: constants.routes.HEALTHY,
  options: {
    auth: false
  },
  handler: (request, h) => h.response('ok')
}

export default home
