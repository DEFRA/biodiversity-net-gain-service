import constants from '../../utils/constants.js'
import { getCombinedCase } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => getCombinedCase(request, h)
}

export default [{
  method: 'GET',
  path: `${constants.routes.COMBINED_CASE_CONTINUE_PROJECT}/{path*}`,
  handler: handlers.get
}]
