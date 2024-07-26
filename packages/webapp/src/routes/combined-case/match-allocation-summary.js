import constants from '../../utils/constants.js'
import { getMatchingHabitats } from '../../utils/combined-case/helpers.js'

const handlers = {
  get: (request, h) => {
    const matchingComplete = request.yar.get(constants.redisKeys.COMBINED_CASE_MATCH_AVAILABLE_HABITATS_COMPLETE)

    if (!matchingComplete) {
      return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
    }

    const habitats = request.yar.get(constants.redisKeys.COMBINED_CASE_ALLOCATION_HABITATS_PROCESSING)
    const registrationHabitats = request.yar.get(constants.redisKeys.COMBINED_CASE_REGISTRATION_HABITATS)

    const matchedHabitats = (habitats || []).map((habitat, index) => {
      const matchingHabitats = getMatchingHabitats(habitat, registrationHabitats)
      const matchedHabitat = (matchingHabitats || []).find((matchingHabitat) => matchingHabitat?.id === habitat.matchedHabitatId)
      return {
        text: `${habitat.habitatType} (${habitat.size} ${habitat.measurementUnits} / ${habitat.condition} Condition)`,
        value: matchedHabitat ? `${matchedHabitat.size} ${matchedHabitat.measurementUnits} / ${matchedHabitat.condition} Condition` : '',
        valueDataTestId: `habitat-${index + 1}`,
        href: `${constants.routes.COMBINED_CASE_MATCH_HABITATS}?page=${index + 1}`,
        visuallyHiddenText: habitat.habitatType,
        classes: '',
        show: true
      }
    })

    return h.view(constants.views.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY, { matchedHabitats })
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.COMBINED_CASE_TASK_LIST)
  }
}

export default [
  {
    method: 'GET',
    path: constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY,
    handler: handlers.get
  },
  {
    method: 'POST',
    path: constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY,
    handler: handlers.post
  }
]
