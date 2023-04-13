import constants from '../../utils/constants.js'
import { emailValidator } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { ...getContext(request) }),
  post: async (request, h) => {
    let emailAddresses = request.payload['emailAddresses[]']
    let err = []
    if (typeof emailAddresses === 'string') {
      emailAddresses = [emailAddresses]
      const result = emailValidator(emailAddresses[0], '#emailAddresses[0]')
      if (result) {
        err = [...result.err]
      }
    } else {
      for (const i in emailAddresses) {
        const result = emailValidator(emailAddresses[i], `#emailAddresses[${i}]`)
        if (result) {
          err = [...result.err]
        }
      }
    }

    if (err.length > 0) {
      return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, { ...getContext(request), err })
    }

    if (!emailAddresses) {
      return h.view(constants.views.DEVELOPER_EMAIL_ENTRY, {
        ...getContext(request),
        err: [{
          text: 'Enter your email address',
          href: '#emailAddresses[0]'
        }]
      })
    }

    request.yar.set(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS, [...emailAddresses])
    return h.redirect(constants.routes.DEVELOPER_CHECK_ANSWERS)
  }
}

const getContext = request => ({
  emailAddresses: request.yar.get(constants.redisKeys.DEVELOPER_ADDITIONAL_EMAILS)
})

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_EMAIL_ENTRY,
  handler: handlers.post
}]
