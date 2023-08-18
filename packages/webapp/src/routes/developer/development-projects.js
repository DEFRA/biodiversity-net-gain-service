import constants from '../../utils/constants.js'

export default {
  method: 'GET',
  path: constants.routes.DEVELOPER_DEVELOPMENT_PROJECTS,
  handler: (_request, h) => h.view(constants.views.DEVELOPER_DEVELOPMENT_PROJECTS)
}
