import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/check-your-details'

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
    it('Should continue journey', async () => {
      await submitPostRequest(postOptions)
    })
  })
})
