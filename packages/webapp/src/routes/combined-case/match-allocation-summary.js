import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    // todo get from session and structure might change
    const habitats = {
      proposed: [
        {
          habitatType: 'Grassland - Other neutral grassland',
          area: '2 hectares',
          condition: 'Moderate Condition'
        },
        {
          habitatType: 'Heathland and shrub - Mixed scrub',
          area: '0.05 hectares',
          condition: 'Good Condition'
        },
        {
          habitatType: 'Woodland and forest - Lowland mixed deciduous woodland',
          area: '20 hectares',
          condition: 'Poor Condition'
        }
      ]
    }

    const matchedHabitats = habitats?.proposed.map((habitat, index) => {
      return {
        text: `${habitat.habitatType} (${habitat.area} / ${habitat.condition})`,
        value: '', // TODO not sure where this comes from
        valueDataTestId: `habitat-${index + 1}`,
        href: `todo?page=${index + 1}`, // todo
        visuallyHiddenText: habitat.habitatType,
        classes: '',
        show: true
      }
    })

    return h.view(constants.views.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY, { matchedHabitats })
  },
  post: async (request, h) => {
    return h.redirect(constants.routes.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY)
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
