import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const isAddressUk = request.yar.get(constants.redisKeys.IS_ADDRESS_UK)
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    return h.view(constants.views.IS_ADDRESS_UK, {
      isAddressUk,
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const isAddressUk = request.payload.isAddressUk
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    request.yar.set(constants.redisKeys.IS_ADDRESS_UK, isAddressUk)
    if (isAddressUk === 'yes') {
      return h.redirect(constants.routes.UK_ADDRESS)
    } else if (isAddressUk === 'no') {
      return h.redirect(constants.routes.NON_UK_ADDRESS)
    } else {
      return h.view(constants.views.IS_ADDRESS_UK, {
        err: [{
          text: `Select yes if your ${isApplicantAgent === 'yes' ? 'client\'s ' : ''}address is in the UK`,
          href: '#is-address-uk-yes'
        }],
        isAddressUk,
        isApplicantAgent
      })
    }
  }
}

export default [{
  method: 'GET',
  path: constants.routes.IS_ADDRESS_UK,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.IS_ADDRESS_UK,
  handler: handlers.post
}]
