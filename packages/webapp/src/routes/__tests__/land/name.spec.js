import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = '/land/name'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.CHECK_YOUR_DETAILS
        },
        url
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
    it('Should continue journey if full name is provided', async () => {
      postOptions.payload.fullName = 'John Smith'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/land/role')
    })
    it('Should fail journey if no name provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter your full name')
    })
    it('Should fail journey if only 1 character provided', async () => {
      postOptions.payload.fullName = 'J'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Full name must be 2 characters or more')
    })

    it('Should return to check your answer page if checkReferer is set', async () => {
      let viewResult
      const h = {
        redirect: (view, context) => {
          viewResult = view
        }
      }
      const redisMap = new Map()
      redisMap.set(constants.redisKeys.REFERER, constants.routes.CHECK_YOUR_DETAILS)
      const request = {
        yar: redisMap,
        payload: {
          fullName: 'Test name'
        }
      }
      const legalAgreementDetails = require('../../land/name')
      await legalAgreementDetails.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.CHECK_YOUR_DETAILS)
    })
  })
})
