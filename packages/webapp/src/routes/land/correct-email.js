import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.EMAIL_VALUE)
    return h.view(constants.views.CORRECT_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    let vewPage = h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.CHECK_YOUR_DETAILS)
    if (request.payload.correctEmail === 'yes') {
      setEmailDetails(request)
    } else {
      const emailValidationError = validateEmail(request.payload.emailAddress)
      if (!emailValidationError) {
        setEmailDetails(request)
      } else {
        vewPage = h.view(constants.views.CORRECT_EMAIL, { errorMessage: emailValidationError.err[0].text, selected: true })
      }
    }
    return vewPage
  }
}

const setEmailDetails = request => {
  request.yar.set(constants.redisKeys.CONFIRM_EMAIL, request.payload.correctEmail)
  if (request.payload.correctEmail === 'no') {
    request.yar.set(constants.redisKeys.EMAIL_VALUE, request.payload.emailAddress)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CORRECT_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CORRECT_EMAIL,
  handler: handlers.post
}]
