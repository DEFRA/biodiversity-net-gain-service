import constants from '../../utils/constants.js'
import {
  getMatchingHabitats,
  habitatDescription,
  habitatHint,
  processMetricData
} from '../../utils/combined-case/helpers.js'

export const getSheetName = (key) => {
  const lookupTable = {
    d2: 'D-2 Off-Site Habitat Creation',
    d3: 'D-3 Off-Site Habitat Enhancement',
    e2: 'E-2 Off-Site Hedge Creation',
    e3: 'E-3 Off-Site Hedge Enhancement',
    f2: 'F-2 Off-Site Watercourse Creation',
    f3: 'F-3 Off-Site Watercourse Enhancement'
  }

  return lookupTable[key] || 'Unknown Key'
}

const getUnprocessedHabitatItems =
  allocationHabitats => allocationHabitats.filter(habitat => !habitat.processed).map(habitat => ({
    value: habitat.id,
    text: habitatDescription(habitat)
  }))

const getMatchedHabitatItems =
  regHabitats => regHabitats.filter(habitat => !habitat.processed).map(habitat => ({
    value: habitat.id,
    text: habitat.habitatType,
    hint: {
      text: habitatHint(habitat)
    }
  }))

const handlers = {
  get: async (request, h) => {
    let allocationHabitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    if (!allocationHabitats) {
      processMetricData(request.yar)
      allocationHabitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
      request.yar.set(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING, allocationHabitats)
    }

    const habitatItems = getUnprocessedHabitatItems(allocationHabitats)
    const { page = '1' } = request.query
    const currentPage = parseInt(page, 10)
    const numberOfPages = habitatItems.length
    const selectedHabitatId = habitatItems[currentPage - 1].value
    request.yar.set(constants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID, selectedHabitatId)
    const registrationHabitats = request.yar.get(constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)
    const selectedHabitat = allocationHabitats.find(habitat => habitat.id === selectedHabitatId)
    const selectedHabitatText = `${selectedHabitat.habitatType} (${selectedHabitat.size} ${selectedHabitat.measurementUnits} / ${selectedHabitat.condition} condition)`
    const matchingHabitats = getMatchingHabitats(selectedHabitat, registrationHabitats)
    const matchedHabitatItems = getMatchedHabitatItems(matchingHabitats)
    const sheetName = getSheetName(selectedHabitat.sheet)
    const safeCurrentPage = Math.max(1, Math.min(currentPage, numberOfPages))
    return h.view(constants.views.COMBINED_CASE_MATCH_HABITATS, {
      numberOfPages,
      currentPage: safeCurrentPage,
      selectedHabitatText,
      matchedHabitatItems,
      sheetName
    })
  },
  post: async (request, h) => {
    const { currentPage, matchHabitats } = request.payload
    const selectedHabitatId = request.yar.get(constants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID)
    const allocationHabitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)
    const updatedAllocationHabitats = allocationHabitats.map(habitat =>
      habitat.id === selectedHabitatId
        ? { ...habitat, matchedHabitatId: matchHabitats, processed: true }
        : habitat
    )
    request.yar.set(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING, updatedAllocationHabitats)

    const nextPage = parseInt(currentPage, 10) + 1
    const habitatItems = getUnprocessedHabitatItems(updatedAllocationHabitats)

    if (!habitatItems.length) {
      request.yar.set(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE, true)
      return h.redirect(constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY)
    }

    return h.redirect(`${constants.routes.COMBINED_CASE_MATCH_HABITATS}?page=${nextPage}`)
  }
}

export default [{
  method: 'GET',
  path: constants.routes.COMBINED_CASE_MATCH_HABITATS,
  handler: handlers.get
}, {
  method: 'POST',
  path: constants.routes.COMBINED_CASE_MATCH_HABITATS,
  handler: handlers.post
}]
