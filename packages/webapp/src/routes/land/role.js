import constants from '../../utils/constants.js'
import { checked } from '../../utils/helpers.js'
import { processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Your details',
      title: 'Add your details'
    }, {
      inProgressUrl: constants.routes.ROLE
    })
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
      return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.EMAIL)
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

export default [{
  method: 'GET',
  path: constants.routes.ROLE,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.ROLE,
  handler: handlers.post
}]
