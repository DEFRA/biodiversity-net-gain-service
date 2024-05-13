import combinedCaseConstants from '../../utils/combined-case/constants.js'
import {
  processMetricData,
  habitatDescription
} from '../../utils/combined-case/helpers.js'

const getUnprocessedHabitatItems =
  allocationHabitats => allocationHabitats.filter(habitat => !habitat.processed).map(habitat => ({
    value: habitat.id,
    text: habitatDescription(habitat)
  }))

const handlers = {
  get: (request, h) => {
    if (!request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)) {
      processMetricData(request.yar)
    }

    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    const habitatItems = getUnprocessedHabitatItems(allocationHabitats)

    return h.view(combinedCaseConstants.views.COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT, { habitatItems })
  },
  post: (request, h) => {
    const selectedHabitatId = request.payload.allocationHabitat
    request.yar.set(combinedCaseConstants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID, selectedHabitatId)

    return h.redirect(combinedCaseConstants.routes.COMBINED_CASE_MATCH_REGISTRATION_HABITAT)
  }
}

export default [
  {
    method: 'GET',
    path: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT,
    handler: handlers.post
  }
]
