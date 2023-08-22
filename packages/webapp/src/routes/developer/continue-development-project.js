import constants from '../../utils/constants.js'
import { getDevelopmentProject } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => {
    const config = {}
    return getDevelopmentProject(request, h, config)
  }
}

export default [{
  method: 'GET',
  path: `${constants.routes.DEVELOPER_CONTINUE_DEVELOPMENT_PROJECT}/{path*}`,
  handler: handlers.get
}]
