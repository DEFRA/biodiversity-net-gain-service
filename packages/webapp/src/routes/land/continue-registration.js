import constants from '../../utils/constants.js'
import { getRegistration } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => {
    const config = {}
    return getRegistration(request, h, config)
  }
}

export default [{
  method: 'GET',
  path: `${constants.routes.CONTINUE_REGISTRATION}/{path*}`,
  handler: handlers.get
}]
