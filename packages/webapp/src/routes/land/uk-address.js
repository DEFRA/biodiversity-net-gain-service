import constants from '../../utils/constants.js'
import { redirectAddress, validateAddress, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the applicant'
    }, {
      inProgressUrl: constants.routes.UK_ADDRESS
    })

    const isApplicantAgent = request.yar.get(constants.cacheKeys.IS_AGENT)
    const address = request.yar.get(constants.cacheKeys.UK_ADDRESS_KEY)
    return h.view(constants.views.UK_ADDRESS, {
      isApplicantAgent,
      address
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.cacheKeys.IS_AGENT)
    const isIndividualOrOrganisation = request.yar.get(constants.cacheKeys.CLIENT_INDIVIDUAL_ORGANISATION_KEY)
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
      return h.view(constants.views.UK_ADDRESS, {
        err,
        isApplicantAgent,
        address,
        ...errors
      })
    } else {
      request.yar.set(constants.cacheKeys.UK_ADDRESS_KEY, address)
      request.yar.set(constants.cacheKeys.NON_UK_ADDRESS_KEY, null)
      return redirectAddress(h, request.yar, isApplicantAgent, isIndividualOrOrganisation)
    }
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
