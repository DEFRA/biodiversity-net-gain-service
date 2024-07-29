import constants from '../../utils/constants.js'
import { validateAddress } from '../../utils/helpers.js'
import { getNextStep } from '../../journey-validation/task-list-generator-v5.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    const address = request.yar.get(constants.redisKeys.NON_UK_ADDRESS_KEY)
    return h.view(constants.views.NON_UK_ADDRESS, {
      isApplicantAgent,
      address
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    const { addressLine1, addressLine2, addressLine3, town, postcode, country } = request.payload
    const address = {
      addressLine1,
      addressLine2,
      addressLine3,
      town,
      postcode,
      country
    }
    const errors = validateAddress(address, false)
    if (errors) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })
      return h.view(constants.views.NON_UK_ADDRESS, {
        err,
        isApplicantAgent,
        address,
        ...errors
      })
    } else {
      request.yar.set(constants.redisKeys.NON_UK_ADDRESS_KEY, address)
      request.yar.set(constants.redisKeys.UK_ADDRESS_KEY, null)
      return getNextStep(request, h)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.NON_UK_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.NON_UK_ADDRESS,
  handler: handlers.post
}]
