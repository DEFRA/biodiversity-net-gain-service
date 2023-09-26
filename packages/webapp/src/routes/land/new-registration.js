import constants from '../../utils/constants.js'
import { newRegistration } from '../../utils/new-application.js'

const handlers = {
  get: async (request, h) => newRegistration(request, h)
}

export default [{
  method: 'GET',
  path: `${constants.routes.NEW_REGISTRATION}`,
  handler: handlers.get
}]
