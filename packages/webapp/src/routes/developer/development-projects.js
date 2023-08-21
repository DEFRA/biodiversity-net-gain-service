import constants from '../../utils/constants.js'
import { getContextForAllocations } from '../../utils/get-context-for-applications-by-type.js'

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS,
  handler: async (request, h) => h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECTS, {
    ...await getContextForAllocations(request)
  })
}
