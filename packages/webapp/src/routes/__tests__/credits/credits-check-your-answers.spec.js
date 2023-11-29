import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../credits/constants.js'
const url = constants.routes.CREDITS_CHECK_YOUR_ANSWERS

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({
        headers: {
          referer: constants.routes.CREDITS_CHECK_YOUR_ANSWERS
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
    it('Should continue journey if reference number provided', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/credits/credits-confirmation')
    })
  })
})
