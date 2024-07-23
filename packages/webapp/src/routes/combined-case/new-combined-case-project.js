import constants from '../../utils/constants.js'
import { newCombinedCase } from '../../utils/new-application.js'

const handlers = {
  get: async (request, h) => newCombinedCase(request, h)
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_NEW_PROJECT,
  handler: handlers.get
}]
