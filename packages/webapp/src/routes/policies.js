import constants from '../utils/constants.js'

const policies = {
  method: 'GET',
  path: constants.routes.POLICIES,
  options: {
    auth: false
  },
  handler: async (_request, h) => h.view(constants.views.POLICIES)
}

export default policies
