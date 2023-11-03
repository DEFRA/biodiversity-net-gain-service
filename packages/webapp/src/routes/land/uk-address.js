import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const ukAddress = request.yar.get(constants.redisKeys.UK_ADDRESS)
    return h.view(constants.views.UK_ADDRESS, {
      isApplicantAgent,
      ukAddress
    })
  },
  post: async (request, h) => {
    const { addressLine1, addressLine2, town, county, postcode } = request.payload
    const ukAddress = {
      addressLine1,
      addressLine2,
      town,
      county,
      postcode
    }
    request.yar.set(constants.redisKeys.UK_ADDRESS, ukAddress)
    // TODO: Next route not implemented
    return h.redirect(constants.routes.UK_ADDRESS)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.UK_ADDRESS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.UK_ADDRESS,
  handler: handlers.post
}]
