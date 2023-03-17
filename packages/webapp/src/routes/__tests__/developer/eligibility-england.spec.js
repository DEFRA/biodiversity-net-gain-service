import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = constants.routes.DEVELOPER_ELIGIBILITY_ENGLAND

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      await submitGetRequest({ url })
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

    // Note: More test cases will be added in next PR
    it('should redirect to the next page', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('#')
    })
  })
})
