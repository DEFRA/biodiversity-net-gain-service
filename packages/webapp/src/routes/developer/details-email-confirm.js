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
    // Note: Temp location added and will be cover into next ticket
    let viewPage = h.redirect(request.yar.get(constants.redisKeys.DEVELOPER_REFERER, true) || '#')
    if (request.payload.correctEmail === 'yes') {
      setEmailDetails(request)
    } else {
      const emailValidationError = emailValidator(request.payload.emailAddress)
      if (!emailValidationError) {
        setEmailDetails(request)
      } else {
        if (emailValidationError.err[0].text === 'Enter your email address') {
          emailValidationError.err[0].text = 'Email address cannot be left blank'
        }
        viewPage = h.view(constants.views.DEVELOPER_DETAILS_EMAIL_CONFIRM, { errorMessage: emailValidationError.err[0].text, selected: true })
      }
    }
    return viewPage
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
