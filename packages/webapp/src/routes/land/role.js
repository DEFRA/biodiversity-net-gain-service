import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const role = request.yar.get(constants.redisKeys.ROLE_KEY)
    const roleOther = request.yar.get(constants.redisKeys.ROLE_OTHER)
    return h.view(constants.views.ROLE, {
      role,
      roleOther,
      checked
    })
  },
  post: async (request, h) => {
    const role = request.payload.role
    const roleOther = request.payload.roleOther
    const error = validateData(role, roleOther)
    if (error) {
      return h.view(constants.views.ROLE, {
        role,
        roleOther,
        checked,
        ...error
      })
    } else {
      request.yar.set(constants.redisKeys.ROLE_KEY, role)
      request.yar.set(constants.redisKeys.ROLE_OTHER, roleOther)
      return h.redirect(constants.routes.CHECK_YOUR_DETAILS)
    }
  }
}

const validateData = (role, roleOther) => {
  const error = {}
  if (!role) {
    error.err = [{
      text: 'Select the role',
      href: '#role'
    }]
  } else if (role === 'Other' && !roleOther) {
    error.err = [{
      text: 'Other type of role cannot be left blank',
      href: '#roleOther'
    }, {
      text: '',
      href: ''
    }]
  }
  return error.err ? error : null
}

// nunjucks template function
const checked = (role, val) => role === val

export default [{
  method: 'GET',
  path: constants.routes.ROLE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ROLE,
  handler: handlers.post
}]
