import combinedCaseConstants from '../../utils/combined-case/constants.js'
import { summariseHabitatMatches } from '../../utils/combined-case/helpers.js'

const handlers = {
  get: (request, h) => {
    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    const registrationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)

    const habitatMatches = JSON.stringify(summariseHabitatMatches(registrationHabitats, allocationHabitats), null, 2)
    console.log(habitatMatches)
    return h.view(combinedCaseConstants.views.COMBINED_CASE_HABITAT_SUMMARY, { habitatMatches })
  }
  // post: (request, h) => {
  //   return h.redirect(combinedCaseConstants.routes.COMBINED_CASE_MATCH_REGISTRATION_HABITAT)
  // }
}

export default [
  {
    method: 'GET',
    path: combinedCaseConstants.routes.COMBINED_CASE_HABITAT_SUMMARY,
    handler: handlers.get
  }
  // {
  //   method: 'POST',
  //   path: combinedCaseConstants.routes.COMBINED_CASE_SUMMARISE_HABITATS,
  //   handler: handlers.post
  // }
]
