import constants from '../../utils/constants.js'
import { emailValidator } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, {
      emailAddress,
      // An option Yes would be selected by default as per discussion on 21-03-2023 with team
      correctEmail: 'yes'
    })
  },
  post: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    const correctEmail = request.payload.correctEmail
    if (correctEmail === 'yes') {
      setEmailDetails(request)
    } else {
      const newEmailAddress = request.payload.newEmailAddress
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
    }
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
