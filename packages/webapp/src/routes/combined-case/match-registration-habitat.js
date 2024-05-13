import combinedCaseConstants from '../../utils/combined-case/constants.js'
import {
  habitatDescription,
  getMatchingHabitats
} from '../../utils/combined-case/helpers.js'

const getMatchedHabitatItems =
  regHabitats => regHabitats.filter(habitat => !habitat.processed).map(habitat => ({
    value: habitat.id,
    text: habitatDescription(habitat)
  }))

const handlers = {
  get: (request, h) => {
    const selectedHabitatId = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID)
    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    const registrationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)

    const selectedHabitat = allocationHabitats.find(habitat => habitat.id === selectedHabitatId)
    const matchingHabitats = getMatchingHabitats(selectedHabitat, registrationHabitats)
    const habitatItems = getMatchedHabitatItems(matchingHabitats)

    return h.view(combinedCaseConstants.views.COMBINED_CASE_MATCH_REGISTRATION_HABITAT, {
      habitatItems,
      backLink: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT
    })
  },
  post: (request, h) => {
    const selectedRegistrationHabitatId = request.payload.registrationHabitat
    const selectedAllocationHabitatId = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_SELECTED_HABITAT_ID)
    const allocationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS)
    const registrationHabitats = request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)

    const selectedAllocationHabitat = allocationHabitats.find(habitat => habitat.id === selectedAllocationHabitatId)
    const selectedRegistrationHabitat = registrationHabitats.find(habitat => habitat.id === selectedRegistrationHabitatId)

    selectedAllocationHabitat.processed = true
    selectedRegistrationHabitat.processed = true

    selectedAllocationHabitat.id = selectedRegistrationHabitatId

    request.yar.set(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS, allocationHabitats)
    request.yar.set(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS, registrationHabitats)

    if (allocationHabitats.findIndex(habitat => habitat.processed === false) !== -1) {
      return h.redirect(combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_ALLOCATION_HABITAT)
    } else {
      return h.redirect(combinedCaseConstants.routes.COMBINED_CASE_HABITAT_SUMMARY)
    }
  }
}

export default [
  {
    method: 'GET',
    path: combinedCaseConstants.routes.COMBINED_CASE_MATCH_REGISTRATION_HABITAT,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: combinedCaseConstants.routes.COMBINED_CASE_MATCH_REGISTRATION_HABITAT,
    handler: handlers.post
  }
]
