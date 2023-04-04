import constants from '../../../utils/constants.js'

const url = constants.routes.DEVELOPER_ELIGIBILITY_RESULT

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view with default content if eligibility value is No`, async () => {
      const { viewResult, contextResult } = await processEligibilityMetric('no')
      expect(viewResult).toEqual(constants.views.DEVELOPER_ELIGIBILITY_RESULT)
      expect(contextResult.pageHeading).toEqual('You do not have everything you need to record off-site biodiversity gain for your development project')
    })

    it(`should render the ${url.substring(1)} view with default content if eligibility value is I/'m not sure`, async () => {
      const { viewResult, contextResult } = await processEligibilityMetric('no-sure')
      expect(viewResult).toEqual(constants.views.DEVELOPER_ELIGIBILITY_RESULT)
      expect(contextResult.pageHeading).toEqual('You do not have everything you need to record off-site biodiversity gain for your development project')
    })

    it(`should render the ${url.substring(1)} view with other content if eligibility value is Yes`, async () => {
      const { viewResult, contextResult } = await processEligibilityMetric('yes')
      expect(viewResult).toEqual(constants.views.DEVELOPER_ELIGIBILITY_RESULT)
      expect(contextResult.pageHeading).toEqual('You have everything you need to record off-site biodiversity gain for your development project')
    })
  })
})

const processEligibilityMetric = async (eligibilityValue) => {
  let viewResult, contextResult
  const redisMap = new Map()
  const eligibilityResult = require('../../developer/eligibility-result.js')
  redisMap.set(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE, eligibilityValue)
  const request = {
    yar: redisMap
  }
  const h = {
    view: (view, context) => {
      viewResult = view
      contextResult = context
    }
  }
  await eligibilityResult.default[0].handler(request, h)
  return { viewResult, contextResult }
}
