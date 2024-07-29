import constants from '../../utils/constants.js'
import { validateAddress } from '../../utils/helpers.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    const address = request.yar.get(constants.redisKeys.UK_ADDRESS_KEY)
    return h.view(constants.views.UK_ADDRESS, {
      isApplicantAgent,
      address
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    const { addressLine1, addressLine2, town, county, postcode } = request.payload
    const address = {
      addressLine1,
      addressLine2,
      town,
      county,
      postcode
    }

    const errors = validateAddress(address, true)

    if (errors && Object.values(errors).some((el) => el !== undefined)) {
      const err = []
      Object.keys(errors).forEach(item => {
        err.push(errors[item])
      })
      return h.redirectView(constants.views.UK_ADDRESS, {
        err,
        isApplicantAgent,
        address,
        ...errors
      })
    } else {
      request.yar.set(constants.redisKeys.UK_ADDRESS_KEY, address)
      request.yar.set(constants.redisKeys.NON_UK_ADDRESS_KEY, null)
      return getNextStep(request, h)
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UK_ADDRESS,
  handler: addRedirectViewUsed(handlers.get)
}, {
  method: 'POST',
  path: constants.routes.UK_ADDRESS,
  handler: addRedirectViewUsed(handlers.post)
}]
