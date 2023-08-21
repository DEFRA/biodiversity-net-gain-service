import constants from '../../utils/constants.js'
import { getAllocation } from '../../utils/get-application.js'

const handlers = {
  get: async (request, h) => {
    const config = {}
    return await getAllocation(request, h, config)
  }
}

export default [{
  method: 'GET',
  path: `${constants.routes.DEVELOPER_CONTINUE_ALLOCATION}/{path*}`,
  handler: handlers.get
}]
