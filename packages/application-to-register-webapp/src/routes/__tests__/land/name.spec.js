import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/name'

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
      postOptions.payload.fullName = 'John Smith'
      postOptions.payload.checkReferer = 'true'
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual('/land/check-your-details')
    })
  })
})
