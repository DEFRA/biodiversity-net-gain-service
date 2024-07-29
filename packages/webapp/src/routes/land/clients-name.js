import constants from '../../utils/constants.js'
import { validateFirstLastNameOfLandownerOrLeaseholder } from '../../utils/helpers.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const individual = request.yar.get(constants.redisKeys.CLIENTS_NAME_KEY)
    return h.view(constants.views.CLIENTS_NAME, {
      individual: individual?.value
    })
  },
  post: async (request, h) => {
    const { firstName, lastName } = request.payload
    const errors = {
      firstNameError: validateFirstLastNameOfLandownerOrLeaseholder(firstName, 'first name', '#firstName'),
      lastNameError: validateFirstLastNameOfLandownerOrLeaseholder(lastName, 'last name', '#lastName')
    }

    if (errors.firstNameError || errors.lastNameError) {
      const err = []
      Object.keys(errors).forEach(item => {
        if (errors[item]) {
          err.push(errors[item].err[0])
        }
      })
      return h.redirectView(constants.views.CLIENTS_NAME, {
        err,
        firstNameError: errors.firstNameError?.err[0],
        lastNameError: errors.lastNameError?.err[0],
        individual: {
          firstName,
          lastName
        }
      })
    }

    request.yar.set(constants.redisKeys.CLIENTS_NAME_KEY, { type: 'individual', value: { firstName, lastName } })
    return getNextStep(request, h)
  }
}
export default [{
  method: 'GET',
  path: constants.routes.CLIENTS_NAME,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.CLIENTS_NAME,
  handler: addRedirectViewUsed(handlers.post)
}]
