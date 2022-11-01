import constants from '../../../utils/constants.js'
import { submitPostRequest } from '../helpers/server.js'
const url = '/land/check-ownership-details'
const mockDataPath = 'packages/application-to-register-webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-ownership-details.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.FULL_NAME, 'Satoshi')
        redisMap.set(constants.redisKeys.LANDOWNER_CONSENT_KEY, 'Yes')
        redisMap.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, mockDataPath)
        redisMap.set(constants.redisKeys.ROLE_KEY, 'Landowner')
        redisMap.set(constants.redisKeys.LANDOWNERS, '')
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
        expect(viewResult).toEqual(constants.views.CHECK_OWNERSHIP_DETAILS)
        expect(contextResult.name).toBe('Satoshi')
        expect(contextResult.consent).toBe(false)
        expect(contextResult.fileName).toBe('legal-agreements')
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
    it('should flow to register task list', async () => {
      const response = await submitPostRequest(postOptions)
      expect(response.headers.location).toBe(constants.routes.REGISTER_LAND_TASK_LIST)
    })
  })
})
