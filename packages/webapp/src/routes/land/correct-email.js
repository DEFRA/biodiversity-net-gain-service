import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.LAND_OWNER_EMAIL)
    return h.view(constants.views.CORRECT_OWNER_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    if (request.payload.correctEmail === 'yes') {
      return h.redirect(request.yar.get(constants.redisKeys.REFERER) || constants.routes.CHECK_YOUR_DETAILS)
    } else {
      return h.redirect(constants.routes.LAND_OWNER_EMAIL)
    }
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
