import constants from '../../utils/constants.js'
import { redirectAddress, validateAddress } from '../../utils/helpers.js'
import { addRedirectViewUsed } from '../../utils/redirect-view-handler.js'

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
    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
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
      return redirectAddress(h, request.yar, isApplicantAgent, isIndividualOrOrganisation)
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
