import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const nonUkAddress = request.yar.get(constants.redisKeys.NON_UK_ADDRESS)
    return h.view(constants.views.NON_UK_ADDRESS, {
      isApplicantAgent,
      nonUkAddress
    })
  },
  post: async (request, h) => {
    const { addressLine1, addressLine2, addressLine3, town, postcode, country } = request.payload
    const nonUkAddress = {
      addressLine1,
      addressLine2,
      addressLine3,
      town,
      postcode,
      country
    }
    request.yar.set(constants.redisKeys.NON_UK_ADDRESS, nonUkAddress)
    // TODO: Next route not yet implemented
    return h.redirect(constants.routes.NON_UK_ADDRESS)
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
