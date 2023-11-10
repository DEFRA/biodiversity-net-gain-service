import constants from '../../utils/constants.js'
import { validateEmail, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.CLIENTS_EMAIL_ADDRESS
    })
    const email = request.yar.get(constants.redisKeys.CLIENTS_EMAIL_ADDRESS)
    return h.view(constants.views.CLIENTS_EMAIL_ADDRESS, {
      email
    })
  },
  post: async (request, h) => {
    const email = request.payload.email
    const error = validateEmail(email, '#email')
    if (error) {
      if (error.err[0].text === 'Enter your email address') {
        error.err[0].text = 'Enter email address'
      }
      return h.view(constants.views.CLIENTS_EMAIL_ADDRESS, {
        err: error.err,
        email
      })
    }
    request.yar.set(constants.redisKeys.CLIENTS_EMAIL_ADDRESS, email)
    return h.redirect(constants.routes.CLIENTS_PHONE_NUMBER)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_EMAIL_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_EMAIL_ADDRESS,
  handler: handlers.post
}]
