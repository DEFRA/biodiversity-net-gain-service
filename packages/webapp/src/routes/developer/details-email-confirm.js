import constants from '../../utils/constants.js'
import { emailValidator, processDeveloperTask } from '../../utils/helpers.js'

const href = '#email-correct-yes'
const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, { emailAddress })
  },
  post: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    const newEmailAddress = request.payload.newEmailAddress
    const correctEmail = request.payload.correctEmail
    if (correctEmail === 'yes') {
      setEmailDetails(request)
    } else if (correctEmail === 'no') {
      const emailValidationError = emailValidator(request.payload.newEmailAddress)
      if (!emailValidationError) {
        setEmailDetails(request)
      } else {
        let errorMessage = emailValidationError.err[0].text
        /* istanbul ignore else */
        if (errorMessage === 'Enter your email address') {
          errorMessage = 'Email address cannot be left blank'
        }
        return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, { errorMessage, correctEmail, newEmailAddress, emailAddress })
      }
    } else {
      return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, {
        err: [
          {
            text: 'You need to select an option',
            href
          }
        ],
        newEmailAddress,
        emailAddress
      })
    }
    processDeveloperTask(request, { taskTitle: 'Your details', title: 'Add your details' }, { status: constants.IN_PROGRESS_DEVELOPER_TASK_STATUS })
    return h.redirect(constants.routes.DEVELOPER_DETAILS_CONFIRM)
  }
}

const setEmailDetails = request => {
  request.yar.set(constants.redisKeys.DEVELOPER_CONFIRM_EMAIL, request.payload.correctEmail)
  if (request.payload.correctEmail === 'no') {
    request.yar.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, request.payload.newEmailAddress)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL_CONFIRM,
  handler: handlers.post
}]
