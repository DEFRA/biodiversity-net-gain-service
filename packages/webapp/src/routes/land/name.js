import constants from '../../utils/constants.js'
import { getReferrer, setReferrer } from '../../utils/helpers.js'

const ID = '#fullName'

const handlers = {
  get: async (request, h) => {
    setReferrer(request, constants.redisKeys.NAME_KEY)
    const fullName = request.yar.get(constants.redisKeys.FULL_NAME)
    return h.view(constants.views.NAME, {
      fullName
    })
  },
  post: async (request, h) => {
    const fullName = request.payload.fullName
    const error = validateName(fullName)
    if (error) {
      return h.view(constants.views.NAME, {
        fullName,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.FULL_NAME, fullName)
      const referredFrom = getReferrer(request, constants.redisKeys.NAME_KEY, true)
      if (constants.REFERRAL_PAGE_LIST.includes(referredFrom)) {
        return h.redirect(referredFrom)
      }
      return h.redirect(constants.routes.ROLE)
    }
  }
}

const validateName = fullName => {
  const error = {}
  if (!fullName) {
    error.err = [{
      text: 'Enter your full name',
      href: ID
    }]
  } else if (fullName.length < 2) {
    error.err = [{
      text: 'Full name must be 2 characters or more',
      href: ID
    }]
  }
  return error.err ? error : null
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
