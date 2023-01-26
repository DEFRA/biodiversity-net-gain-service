import constants from '../../utils/constants.js'
import { postJson } from '../../utils/http.js'
const functionAppUrl = process.env.AZURE_FUNCTION_APP_URL || 'http://localhost:7071/api'

const handlers = {
  get: async (request, h) => {
    return h.view(constants.views.CONTINUE_SAVED_REGISTRATION)
  },
  post: async (request, h) => {
    const payload = validatePayload(request.payload)

    // Get session for values
    const session = await postJson(`${functionAppUrl}/getapplicationsession`, payload)

    // Restore session to Yar object
    request.yar.set(session)

    // Redirect to saved referer or default to task list
    return h.redirect(session[constants.redisKeys.REGISTRATION_SAVED_REFERER] || constants.routes.REGISTER_LAND_TASK_LIST)
  }
}

const validatePayload = payload => {
  return {
    applicationReference: payload.applicationReference,
    email: payload.email.toLowerCase()
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CONTINUE_SAVED_REGISTRATION,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CONTINUE_SAVED_REGISTRATION,
  handler: handlers.post
}]
