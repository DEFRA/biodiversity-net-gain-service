import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.DEVELOPER_EMAIL_ENTRY)
  // post: async (_request, h) => h.redirect(constants.routes.DEVELOPER_CHECK_ANSWERS)
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.get
}]
// {
//   method: 'POST',
//   path: constants.routes.DEVELOPER_EMAIL_ENTRY,
//   handler: handlers.post
// }
// ]
