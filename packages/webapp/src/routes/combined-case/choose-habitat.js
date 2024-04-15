import combinedCaseConstants from '../../utils/combined-case/constants.js'
import { processMetricData } from '../../utils/combined-case/helpers.js'

// TODO:
// 1. List habitats in the Allocation metric
// 2. Select each one in turn
//   a. Select which registration habitat it relates to (ASSUME WE CAN MATCH VIA HABITAT)
//   b. Show their refs for habitats if they have entered them to help matching

const getUnprocessedHabitatItems =
  allocationHabitats => allocationHabitats.filter(habitat => !habitat.processed).map(habitat => ({
    value: habitat.id,
    text: `${habitat.habitatType} || ${habitat.condition} || ${habitat.size} ${habitat.measurementUnits}`
  }))

const handlers = {
  get: (request, h) => {
    if (!request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)) {
      processMetricData(request.yar)
    }

    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    const habitatItems = getUnprocessedHabitatItems(allocationHabitats)

    return h.view(combinedCaseConstants.views.COMBINED_CASE_CHOOSE_HABITAT, { habitatItems })
  },
  post: (request, h) => {
    const selectedHabitatId = request.payload.allocationHabitat
    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)

    const foundIndex = allocationHabitats.findIndex(habitat => habitat.id === selectedHabitatId)
    allocationHabitats[foundIndex].processed = true
    request.yar.set(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS, allocationHabitats)

    const habitatItems = getUnprocessedHabitatItems(allocationHabitats)

    return h.view(combinedCaseConstants.views.COMBINED_CASE_CHOOSE_HABITAT, { habitatItems })
  }
}

export default [
  {
    method: 'GET',
    path: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_HABITAT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_HABITAT,
    handler: handlers.post
  }
]
