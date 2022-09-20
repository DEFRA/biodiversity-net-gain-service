import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/add-grid-reference'

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
    it('should continue journey if valid grid reference is entered', async () => {
      postOptions.payload.gridReference = 'SL123456'
      await submitPostRequest(postOptions)
    })
    it('should show appropriate error if grid reference is empty', async () => {
      postOptions.payload.gridReference = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the grid reference')
    })
    it('should show appropriate error if grid reference is too short', async () => {
      postOptions.payload.gridReference = 'SK'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must be between 6 and 14 characters')
    })
    it('should show appropriate error if grid reference is too long', async () => {
      postOptions.payload.gridReference = 'SK12345678901234567890'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must be between 6 and 14 characters')
    })
    it('should show appropriate error if grid reference is not a valid grid reference', async () => {
      postOptions.payload.gridReference = 'ZZ9999999999'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Grid reference must start with two letters, followed by only numbers and spaces, like SE 170441')
    })
  })
})
