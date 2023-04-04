import constants from '../../utils/constants.js'

const handlers = {
  get: async (request, h) => {
    const eligibilityMetricValue = request.yar.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)
    let pageHeading = 'You do not have everything you need to record off-site biodiversity gain for your development project'
    if (eligibilityMetricValue === 'yes') {
      pageHeading = 'You have everything you need to record off-site biodiversity gain for your development project'
    }
    return h.view(constants.views.DEVELOPER_ELIGIBILITY_RESULT, { pageHeading, eligibilityMetricValue })
  }
}

export default [{
  method: 'GET',
  path: constants.routes.DEVELOPER_ELIGIBILITY_RESULT,
  handler: handlers.get
}]
