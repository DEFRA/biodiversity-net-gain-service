import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'
const phoneRegex = /^[\d-+()#]*$/ // Very basic regex authored by tmason (ergo its probably bad) checks string is numeric or special chars -+()#

const handlers = {
  get: async (request, h) => {
    const phone = request.yar.get(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY)
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
    request.yar.set(constants.redisKeys.CLIENTS_PHONE_NUMBER_KEY, phone)
    return getNextStep(request, h)
  }
}

const validatePhone = (phone) => {
  if (!phone) {
    return [{
      text: 'Enter a phone number',
      href: '#phone'
    }]
  }
  if (!phoneRegex.test(phone)) {
    return [{
      text: 'Enter a phone number, like 01632 960 001, 07700 900 982 or +44 808 157 0192',
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
