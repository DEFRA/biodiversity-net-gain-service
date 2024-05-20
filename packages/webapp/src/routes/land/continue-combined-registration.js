import constants from '../../utils/constants.js'
import { getCombinedCase } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => getCombinedCase(request, h)
}

export default [{
  method: 'GET',
  path: `${constants.routes.CONTINUE_COMBINED_REGISTRATION}/{path*}`,
  handler: handlers.get
}]
