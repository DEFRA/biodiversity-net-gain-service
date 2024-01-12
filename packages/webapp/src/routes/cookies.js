import constants from '../utils/constants.js'

const cookies = {
  method: 'GET',
  path: constants.routes.COOKIES,
  options: {
    auth: false
  },
  handler: async (_request, h) => h.view(constants.views.COOKIES)
}

export default cookies
