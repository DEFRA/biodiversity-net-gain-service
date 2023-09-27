import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.CHECK_OWNERSHIP_DETAILS
const mockDataPath = 'packages/webapp/src/__mock-data__/uploads/legal-agreements'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
    })

    it(`should render the ${url.substring(1)} view`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-ownership-details.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.FULL_NAME, 'Satoshi')
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
        expect(contextResult.landownerNames).toEqual(['Satoshi'])
        expect(contextResult.consent).toBe(false)
        expect(contextResult.fileName).toBe('legal-agreements')
      })
    })
    it(`should render the ${url.substring(1)} view and show list of landowners combined with applicant name if landowner`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-ownership-details.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.FULL_NAME, 'Satoshi')
        redisMap.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, mockDataPath)
        redisMap.set(constants.redisKeys.ROLE_KEY, 'Landowner')
        redisMap.set(constants.redisKeys.LANDOWNERS, ['test1', 'test2'])
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
        expect(contextResult.landownerNames).toEqual(['Satoshi', 'test1', 'test2'])
        expect(contextResult.consent).toBe(false)
        expect(contextResult.fileName).toBe('legal-agreements')
      })
    })
    it(`should render the ${url.substring(1)} view and show list of landowners combined without applicant name if not landowner`, async () => {
      jest.isolateModules(async () => {
        let viewResult, contextResult
        const legalAgreementDetails = require('../../land/check-ownership-details.js')
        const redisMap = new Map()
        redisMap.set(constants.redisKeys.FULL_NAME, 'Satoshi')
        redisMap.set(constants.redisKeys.LAND_OWNERSHIP_LOCATION, mockDataPath)
        redisMap.set(constants.redisKeys.ROLE_KEY, 'other')
        redisMap.set(constants.redisKeys.LANDOWNERS, ['test1', 'test2'])
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
        expect(contextResult.landownerNames).toEqual(['test1', 'test2'])
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
