import constants from '../utils/constants.js'

const contactus = {
  method: 'GET',
  path: constants.routes.CONTACTUS,
  options: {
    auth: false
  },
  handler: async (_request, h) => h.view(constants.views.CONTACTUS)
}

export default contactus
