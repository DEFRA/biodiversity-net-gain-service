import constants from '../utils/constants.js'

const privacy = {
  method: 'GET',
  path: constants.routes.PRIVACY,
  options: {
    auth: false
  },
  handler: async (_request, h) => h.view(constants.views.PRIVACY)
}

export default privacy
