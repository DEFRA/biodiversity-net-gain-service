import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server'

const url = '/land/check-management-monitoring-details'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  const redisMap = new Map()
  beforeEach(() => {
    redisMap.set(constants.redisKeys.MANAGEMENT_PLAN_LOCATION, mockDataPath)
    redisMap.set(constants.redisKeys.HABITAT_WORKS_START_DATE_KEY, '2022-03-11T00:00:00.000Z')
    redisMap.set(constants.redisKeys.MANAGEMENT_MONITORING_START_DATE_KEY, '2023-03-11T00:00:00.000Z')
  })
  describe('GET', () => {
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
        expect(viewResult).toEqual(constants.views.CHECK_MANAGEMENT_MONITORING_SUMMARY)
        expect(contextResult.habitatWorkStartDate).toBe('11 Mar 2022')
        expect(contextResult.managementMonitoringStartDate).toBe('11 Mar 2023')
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
    it('should aflow to task list', async () => {
      const result = await submitPostRequest(postOptions)
      expect(result.statusCode).toBe(302)
      expect(result.headers.location).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
