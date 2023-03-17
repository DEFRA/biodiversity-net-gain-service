import { submitGetRequest, submitPostRequest } from '../helpers/server.js'

const url = '/developer/routing-result'

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
