import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ELIGIBILITY_METRIC

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
  })

  describe('POST', () => {
    let postOptions
    const redisMap = new Map()
    beforeEach(() => {
      postOptions = {
        url,
        yar: redisMap,
        payload: {}
      }
    })

    it('should redirect to eligibility result if Yes selected', async () => {
      let viewResult
      const eligibilityMetricValue = 'yes'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityMetricValue
      }
      const eligibilityMetric = require('../../developer/eligibility-metric.js')
      await eligibilityMetric.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_RESULT)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)).toEqual(eligibilityMetricValue)
    })

    it('should redirect to eligibility result if No is selected', async () => {
      let viewResult
      const eligibilityMetricValue = 'no'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityMetricValue
      }
      const eligibilityMetric = require('../../developer/eligibility-metric.js')
      await eligibilityMetric.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_RESULT)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)).toEqual(eligibilityMetricValue)
    })

    it('should redirect to eligibility result if I\'m not sure is selected', async () => {
      let viewResult
      const eligibilityMetricValue = 'not-sure'
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      postOptions.payload = {
        eligibilityMetricValue
      }
      const eligibilityMetric = require('../../developer/eligibility-metric.js')
      await eligibilityMetric.default[1].handler(postOptions, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_ELIGIBILITY_RESULT)
      expect(redisMap.get(constants.redisKeys.DEVELOPER_ELIGIBILITY_METRIC_VALUE)).toEqual(eligibilityMetricValue)
    })

    it('should show an error if any option is not selected', async () => {
      postOptions.payload = {
        eligibilityMetricValue: undefined
      }
      delete postOptions.yar
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You need to select an option')
    })
  })
})
