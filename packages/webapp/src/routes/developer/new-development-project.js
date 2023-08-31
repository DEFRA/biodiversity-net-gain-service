import constants from '../../utils/constants.js'
import { newDevelopmentProject } from '../../utils/new-application.js'

const handlers = {
  get: async (request, h) => newDevelopmentProject(request, h)
}

export default [{
  method: 'GET',
  path: `${constants.routes.DEVELOPER_NEW_DEVELOPMENT_PROJECT}`,
  handler: handlers.get
}]
