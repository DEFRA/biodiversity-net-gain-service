import constants from '../../utils/constants.js'
import { emailValidator, getErrById } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const emailAddresses = request.yar.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)
    return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { getErrById, emailAddresses })
  },
  post: async (request, h) => {
    const { emailAddresses, err } = getEmailAddressFromPayload(request)
    if (err.length > 0) {
      return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { emailAddresses, err, getErrById })
    }

    request.yar.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, [...emailAddresses])
    return h.redirect(constants.routes.DEVELOPER_CHECK_ANSWERS)
  }
}

const getEmailAddressFromPayload = request => {
  const emailAddresses = []
  const err = []
  const payload = Object.values(request.payload)

  for (const i in payload) {
    const email = payload[i]
    const result = emailValidator(email, `#emailAddresses[${i}]`)
    if (result) {
      err.push(result.err[0])
    }
    emailAddresses.push(email)
  }
  return { emailAddresses, err }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.post
}]
