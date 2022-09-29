import constants from '../utils/constants.js'
import application from '../utils/application.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.CHECK_YOUR_ANSWERS),
  post: async (request, h) => {
    /*
      On post todo:
      Gets the application user session object
      sends session to queue
      creates signalr callback
      returns completed user page
    */

    const answers = application(request.yar)

    return h.redirect(constants.routes.CONFIRMATION)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CHECK_YOUR_ANSWERS,
  handler: handlers.post
}]
