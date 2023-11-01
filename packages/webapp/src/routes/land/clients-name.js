import constants from '../../utils/constants.js'
import {
  processRegistrationTask,
  validateFirstLastName
} from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CLIENTS_NAME
    })

    return h.view(constants.views.CLIENTS_NAME)
  },
  post: async (request, h) => {
    const { firstName, middleName, lastName } = request.payload

    const firstNameError = validateFirstLastName(firstName, 'first name', 'firstNameId')
    const lastNameError = validateFirstLastName(lastName, 'last name', 'lastNameId')

    if (!isEmpty(firstNameError) || !isEmpty(lastNameError)) {
      return h.view(constants.views.CLIENTS_NAME, {
        err: Object.values({ ...firstNameError, ...lastNameError }),
        firstNameError: firstNameError?.err[0],
        lastNameError: lastNameError?.err[0]
      })
    }

    // TODO: REDIRECT to be added in next story
    return h.redirect(constants.routes.CLIENTS_NAME, { middleName })
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_NAME,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_NAME,
  handler: handlers.post
}]
