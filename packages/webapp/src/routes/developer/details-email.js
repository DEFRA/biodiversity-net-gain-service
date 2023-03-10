import constants from '../../utils/constants.js'

const ID = '#emailAddress'

const handlers = {
  get: async (request, h) => {
    const emailAddress = request.yar.get(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
    return h.view(constants.views.DEVELOPER_DETAILS_EMAIL, {
      emailAddress
    })
  },
  post: async (request, h) => {
    const emailAddress = request.payload.emailAddress
    const error = validateEmail(emailAddress)
    if (error) {
      request.yar.clear(constants.redisKeys.DEVELOPER_EMAIL_VALUE)
      return h.view(constants.views.DEVELOPER_DETAILS_EMAIL, {
        emailAddress,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.DEVELOPER_EMAIL_VALUE, emailAddress)
      // Note: Temp location added and will be cover into next ticket
      return h.redirect('#')
    }
  }
}

const checkEmailFormat = emailAddress => {
  return String(emailAddress)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const validateEmail = emailAddress => {
  const error = {}
  if (!emailAddress) {
    error.err = [{
      text: 'Enter your email address',
      href: ID
    }]
  } else if (emailAddress.length > 254) {
    error.err = [{
      text: 'Email address must be 254 characters or less',
      href: ID
    }]
  } else if (!checkEmailFormat(emailAddress)) {
    error.err = [{
      text: 'Enter an email address in the correct format, like name@example.com',
      href: ID
    }]
  }
  return error.err ? error : null
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_DETAILS_EMAIL,
  handler: handlers.post
}]
