import constants from '../utils/constants.js'

const home = {
  method: 'GET',
  path: '/',
  options: {
    auth: false
  },
  handler: (_request, h) => h.redirect(constants.routes.START)
}

export default home
