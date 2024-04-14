import combinedCaseConstants from '../../utils/combined-case/constants.js'

const handlers = {
  get: async (request, h) => {
    console.log(request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_REGISTRATION_METRIC_DATA))
    console.log('========')
    console.log(request.yar.get(combinedCaseConstants.redisKeys.COMBINED_CASE_ALLOCATION_METRIC_DATA))

    return h.view(combinedCaseConstants.views.COMBINED_CASE_CHOOSE_HABITATS)
  }
}

export default [
  {
    method: 'GET',
    path: combinedCaseConstants.routes.COMBINED_CASE_CHOOSE_HABITATS,
    handler: handlers.get
  }
]
