import constants from '../../utils/constants.js'
import { getDeveloperEligibilityResults } from '../../utils/helpers.js'

const handlers = {
  get: async (request, h) => {
    const developerEligibilityResults = getDeveloperEligibilityResults(request.yar)
    console.log('Ajinkya', developerEligibilityResults, constants.developerEligibilityHTML)
    return h.view(constants.views.DEVELOPER_ELIGIBILITY_RESULT, {
      developerEligibilityResults,
      developerEligibilityHTML: constants.developerEligibilityHTML
    })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_RESULT,
  handler: handlers.get
}]
