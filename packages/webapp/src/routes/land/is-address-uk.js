import constants from '../../utils/constants.js'
import { getNextStep } from '../../journey-validation/task-list-generator.js'

const handlers = {
  get: async (request, h) => {
    const isAddressUk = request.yar.get(constants.redisKeys.IS_ADDRESS_UK_KEY)
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    return h.view(constants.views.IS_ADDRESS_UK, {
      isAddressUk,
      isApplicantAgent
    })
  },
  post: async (request, h) => {
    const isAddressUk = request.payload.isAddressUk
    const isApplicantAgent = request.yar.get(constants.redisKeys.IS_AGENT)
    request.yar.set(constants.redisKeys.IS_ADDRESS_UK_KEY, isAddressUk)

    return getNextStep(request, h, (e) => {
      return h.view(constants.views.IS_ADDRESS_UK, {
        err: [e],
        isAddressUk,
        isApplicantAgent
      })
    })
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
