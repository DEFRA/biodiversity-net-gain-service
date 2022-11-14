import constants from '../../utils/constants.js'
import { validateEmail } from '../../utils/helpers.js'

const handlers = {
  get: async (_request, h) => {
    const emailAddress = _request.yar.get(constants.redisKeys.LAND_OWNER_EMAIL)
    return h.view(constants.views.CORRECT_OWNER_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    let vewPage
    if (request.payload.correctEmail === 'yes') {
      setEmailSetails(request)
      vewPage = h.redirect(constants.routes.CHECK_YOUR_DETAILS)
    } else {
      const emailStatus = validateEmail(request.payload.emailAddress)
      if (!emailStatus) {
        setEmailSetails(request)
        vewPage = h.redirect(constants.routes.CHECK_YOUR_DETAILS)
      } else {
        vewPage = h.view(constants.views.CORRECT_OWNER_EMAIL, { errorMessage: emailStatus.err[0].text, selected: true })
      }
    }
    return vewPage
  }
}

const setEmailSetails = request => {
  request.yar.set(constants.redisKeys.CONFIRM_OWNER_EMAIL, request.payload.correctEmail)
  if (request.payload.correctEmail === 'no') {
    request.yar.set(constants.redisKeys.LAND_OWNER_EMAIL, request.payload.emailAddress)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CORRECT_OWNER_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CORRECT_OWNER_EMAIL,
  handler: handlers.post
}]
