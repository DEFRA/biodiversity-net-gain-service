import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server'

const url = constants.routes.CHECK_MANAGEMENT_MONITORING_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  const redisMap = new Map()
  beforeEach(() => {
    redisMap.set(constants.redisKeys.MANAGEMENT_PLAN_LOCATION, mockDataPath)
    // redisMap.set(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY, '2022-03-11T00:00:00.000Z')
    redisMap.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, '2023-03-11T00:00:00.000Z')
  })
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })
    it('should redirect to Start page if no data applicant data is available in session', async () => {
      const response = await submitGetRequest({ url }, 302, {})
      expect(response.headers.location).toEqual(constants.routes.START)
    })
    it(`should render the ${url.substring(1)} view`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-management-monitoring-details.js')
        const request = {
          yar: redisMap
        }
        const h = {
          view: (view, context) => {
            viewResult = view
            contextResult = context
          }
        }
        await legalAgreementDetails.default[0].handler(request, h)
        expect(viewResult).toEqual(constants.views.CHECK_MANAGEMENT_MONITORING_DETAILS)
        expect(contextResult.managementMonitoringStartDate).toBe('11 March 2023')
        expect(contextResult.managementFileName).toBe('legal-agreements')
      })
    })
  })
  describe('POST', () => {
    let postOptions
    beforeEach(() => {
      postOptions = {
        url,
        payload: {}
      }
    })
    it('should flow to task list', async () => {
      const result = await submitPostRequest(postOptions)
      expect(result.statusCode).toBe(302)
      expect(result.headers.location).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
