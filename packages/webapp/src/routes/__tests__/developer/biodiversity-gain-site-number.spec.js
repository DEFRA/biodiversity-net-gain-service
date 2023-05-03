import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.DEVELOPER_BNG_NUMBER

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
    it('Should continue journey if BNG number provided', async () => {
      postOptions.payload.bngNumber = 'BGS-111 222 333'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/developer/upload-metric-file')
    })
    it('Should fail journey if BNG number blank', async () => {
      const res = await submitPostRequest(postOptions, 500)
      expect(res.payload).toContain('Sorry, there is a problem with the service')
      expect(res.payload).toBeDefined()
    })
    it('Should fail journey if only spaces provided', async () => {
      postOptions.payload.bngNumber = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toBeDefined()
    })

    it('Should return to upload metric file if checkReferer is set', async () => {
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
          bngNumber: 'BGS-111 222 333'
        }
      }
      const developerBngNumber = require('../../developer/biodiversity-gain-site-number')
      await developerBngNumber.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.DEVELOPER_CHECK_UPLOAD_METRIC)
    })
  })
})
