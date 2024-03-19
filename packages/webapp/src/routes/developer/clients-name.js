import constants from '../../utils/constants.js'
import {
  processDeveloperTask,
  redirectDeveloperClient,
  validateFirstLastNameOfDeveloperClient
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const individual = request.yar.get(constants.redisKeys.DEVELOPER_CLIENTS_NAME)
    return h.view(constants.views.DEVELOPER_CLIENTS_NAME, {
      individual: individual?.value
    })
  },
  post: async (request, h) => {
    const { firstName, middleNames, lastName } = request.payload
    const errors = {
      firstNameError: validateFirstLastNameOfDeveloperClient(firstName, 'first name', '#firstName'),
      lastNameError: validateFirstLastNameOfDeveloperClient(lastName, 'last name', '#lastName')
    }

    if (errors.firstNameError || errors.lastNameError) {
      const err = []
      Object.keys(errors).forEach(item => {
        if (errors[item]) {
          err.push(errors[item].err[0])
        }
      })
      return h.view(constants.views.DEVELOPER_CLIENTS_NAME, {
        err,
        firstNameError: errors.firstNameError?.err[0],
        lastNameError: errors.lastNameError?.err[0],
        individual: {
          firstName,
          middleNames,
          lastName
        }
      })
    }

    request.yar.set(constants.redisKeys.DEVELOPER_CLIENTS_NAME, { type: 'individual', value: { firstName, middleNames, lastName } })

    // return redirectDeveloperClient(h, request.yar)

    processDeveloperTask(request,
      {
        taskTitle: 'Your details',
        title: 'Add your details'
      }, { status: constants.COMPLETE_DEVELOPER_TASK_STATUS })
    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.DEVELOPER_TASKLIST)
    return h.redirect(constants.routes.DEVELOPER_TASKLIST)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_CLIENTS_NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.DEVELOPER_CLIENTS_NAME,
  handler: handlers.post
}]
