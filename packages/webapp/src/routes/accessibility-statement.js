import constants from '../utils/constants.js'

const accessibilityStatement = {
  method: 'GET',
  path: constants.routes.ACCESSIBILITY_STATEMENT,
  options: {
    auth: false
  },
  handler: async (_request, h) => h.view(constants.views.ACCESSIBILITY_STATEMENT)
}

export default accessibilityStatement
