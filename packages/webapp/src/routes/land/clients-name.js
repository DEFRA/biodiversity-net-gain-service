import constants from '../../utils/constants.js'
import {
  validateFirstLastName,
  processRegistrationTask,
  validateLengthOfCharsLessThan50
} from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.CLIENTS_NAME
    })

    const individual = request.yar.get(constants.redisKeys.CLIENTS_NAME_KEY)
    return h.view(constants.views.CLIENTS_NAME, {
      individual: individual?.value
    })
  },
  post: async (request, h) => {
    const { firstName, middleNames, lastName } = request.payload
    const errors = {
      firstNameError: validateFirstLastName(firstName, 'first name', '#firstName'),
      lastNameError: validateFirstLastName(lastName, 'last name', '#lastName'),
      middleNameError: validateLengthOfCharsLessThan50(middleNames, 'middle name', 'middleNameId')
    }

    if (errors.firstNameError || errors.lastNameError || errors.middleNameError) {
      const err = []
      Object.keys(errors).forEach(item => {
        if (errors[item]) {
          err.push(errors[item].err[0])
        }
      })
      return h.view(constants.views.CLIENTS_NAME, {
        err,
        firstNameError: errors.firstNameError?.err[0],
        lastNameError: errors.lastNameError?.err[0],
        middleNameError: errors.middleNameError?.err[0],
        individual: {
          firstName,
          middleNames,
          lastName
        }
      })
    }

    request.yar.set(constants.redisKeys.CLIENTS_NAME_KEY, { type: 'individual', value: { firstName, middleNames, lastName } })

    return h.redirect(request.yar.get(constants.redisKeys.REFERER, true) || constants.routes.IS_ADDRESS_UK)
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
