import constants from '../../utils/constants.js'

const ID = '#emailAddress'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.LAND_OWNER_EMAIL)
    return h.view(constants.views.LAND_OWNER_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    const emailAddress = request.payload.emailAddress
    const error = validateEmail(emailAddress)
    if (error) {
      return h.view(constants.views.NAME, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.LAND_OWNER_EMAIL, emailAddress)
      return h.redirect(constants.routes.CORRECT_OWNER_EMAIL)
    }
  }
}

const validateEmail = emailAddress => {
  const error = {}
  if (!emailAddress) {
    error.err = [{
      text: 'Enter your email address',
      href: ID
    }]
  } else if (emailAddress.length < 2) { // TODO format validation
    error.err = [{
      text: 'Enter an email address in the correct format, like name@example.com',
      href: ID
    }]
  } else if (emailAddress.length > 254) {
    error.err = [{
      text: 'Email address must be 254 characters or less',
      href: ID
    }]
  }
  return error.err ? error : null
}

export default [{
  method: 'GET',
  path: constants.routes.LAND_OWNER_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.LAND_OWNER_EMAIL,
  handler: handlers.post
}]
