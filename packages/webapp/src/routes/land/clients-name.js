import constants from '../../utils/constants.js'
import {
  validateFirstLastName
} from '../../utils/helpers.js'
import isEmpty from 'lodash/isEmpty.js'

const handlers = {
  get: async (request, h) => {
    const individual = request.yar.get(constants.redisKeys.CLIENTS_NAME)

    return h.view(constants.views.CLIENTS_NAME, { individual })
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

    request.yar.set(constants.redisKeys.CLIENTS_NAME, { type: 'individual', value: { firstName, middleName, lastName } })

    return h.redirect(constants.routes.IS_ADDRESS_UK)
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
