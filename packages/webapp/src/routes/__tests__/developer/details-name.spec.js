import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_DETAILS_NAME

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC
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
      postOptions.payload.fullName = 'John Doe'
      const res = await submitPostRequest(postOptions)
      // Note: Temp location added and will be cover into next ticket
      expect(res.headers.location).toEqual('#')
    })
    it('Should fail journey if no name provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter your full name')
    })
    it('Should fail journey if only 1 character provided', async () => {
      postOptions.payload.fullName = 'U'
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
      redisMap.set(constants.redisKeys.DEVELOPER_REFERER, constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
      const request = {
        yar: redisMap,
        payload: {
          fullName: 'Test name'
        }
      }
      const developerDetails = require('../../developer/details-name')
      await developerDetails.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
    })
  })
})
