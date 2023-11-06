import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const phone = request.yar.get(constants.redisKeys.CLIENTS_PHONE_NUMBER)
    return h.view(constants.views.CLIENTS_PHONE_NUMBER, {
      phone
    })
  },
  post: async (request, h) => {
    const phone = request.payload.phone
    const error = validatePhone(phone)
    if (error) {
      return h.view(constants.views.CLIENTS_PHONE_NUMBER, {
        err: error,
        phone
      })
    }
    request.yar.set(constants.redisKeys.CLIENTS_PHONE_NUMBER, phone)
    return h.redirect(constants.routes.UPLOAD_WRITTEN_AUTHORISATION)
  }
}

const validatePhone = (phone) => {
  if (!phone) {
    return [{
      text: 'Enter a phone number',
      href: '#phone'
    }]
  }
}

export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_PHONE_NUMBER,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_PHONE_NUMBER,
  handler: handlers.post
}]
