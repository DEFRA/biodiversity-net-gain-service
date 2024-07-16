import constants from '../../utils/constants.js'

const handlers = {
  get: (request, h) => {
    return h.view(constants.views.COMBINED_CASE_MATCH_ALLOCATION_SUMMARY,
      {
        habitatA: '',
        habitatB: '',
        habitatC: '5 hectares / Moderate Condition'
      })
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
