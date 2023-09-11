import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.NEED_ADD_ALL_RESPONSIBLE_BODIES
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
    it('Should continue journey if Continue button clicked', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/land/add-responsible-body-conservation-covenant')
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
        }
      }
      const legalAgreementDetails = require('../../land/need-add-all-responsible-bodies.js')
      await legalAgreementDetails.default[1].handler(request, h)
      expect(viewResult).toBe(constants.routes.CHECK_YOUR_DETAILS)
    })
  })
})
