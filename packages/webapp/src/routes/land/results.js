import constants from '../../utils/constants.js'
import { getEligibilityResults } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const eligibilityResults = getEligibilityResults(request.yar)
    return h.view(constants.views.ELIGIBILITY_RESULTS, {
      eligibilityResults,
      eligibilityHTML: constants.eligibilityHTML
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.ELIGIBILITY_RESULTS,
  handler: handlers.get
}]
