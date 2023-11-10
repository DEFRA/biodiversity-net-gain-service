import constants from '../../utils/constants.js'
import { redirectAddress, validateAddress, processRegistrationTask } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    processRegistrationTask(request, {
      taskTitle: 'Applicant information',
      title: 'Add details about the person applying'
    }, {
      status: constants.IN_PROGRESS_REGISTRATION_TASK_STATUS,
      inProgressUrl: constants.routes.NON_UK_ADDRESS
    })
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const address = request.yar.get(constants.redisKeys.NON_UK_ADDRESS)
    return h.view(constants.views.NON_UK_ADDRESS, {
      isApplicantAgent,
      address
    })
  },
  post: async (request, h) => {
    const isApplicantAgent = request.yar.get(constants.redisKeys.APPLICANT_DETAILS_IS_AGENT)
    const isIndividualOrOrganisation = request.yar.get(constants.redisKeys.CLIENT_INDIVIDUAL_ORGANISATION)
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
      request.yar.set(constants.redisKeys.NON_UK_ADDRESS, address)
      return redirectAddress(h, isApplicantAgent, isIndividualOrOrganisation)
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
