import constants from '../../utils/constants.js'
import { emailValidator } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, {
      emailAddress
    })
  },
  post: async (request, h) => {
    if (request.payload.correctEmail === 'yes') {
      setEmailDetails(request)
    } else {
      const emailValidationError = emailValidator(request.payload.emailAddress)
      if (!emailValidationError) {
        setEmailDetails(request)
      } else {
        let errorMessage = emailValidationError.err[0].text
        /* istanbul ignore else */
        if (errorMessage === 'Enter your email address') {
          errorMessage = 'Email address cannot be left blank'
        }
        return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, { errorMessage, selected: true })
      }
    }
    return h.redirect(constants.routes.DEVELOPER_DETAILS_CONFIRM)
  }
}

const setEmailDetails = request => {
  request.yar.set(constants.redisKeys.DEVELOPER_CONFIRM_EMAIL, request.payload.correctEmail)
  if (request.payload.correctEmail === 'no') {
    request.yar.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, request.payload.emailAddress)
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
