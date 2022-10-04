import constants from '../../utils/constants.js'

const handlers = {
  get: async (_request, h) => h.view(constants.views.NAME),
  post: async (request, h) => {
    const fullName = request.payload.fullName
    let context = {}
    if (!fullName) {
      context = {
        err: [{
          text: 'Enter your full name',
          href: '#fullName'
        }]
      }
    } else if (fullName.length < 2) {
      context = {
        err: [{
          text: 'Full name must be 2 characters or more',
          href: '#fullName'
        }]
      }
    }
    if (context.err) {
      return h.view(constants.views.NAME, {
        fullName,
        ...context
      })
    } else {
      request.yar.set(constants.redisKeys.FULL_NAME)
      return h.redirect(constants.routes.ROLE)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NAME,
  handler: handlers.post
}]
