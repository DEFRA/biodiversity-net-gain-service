import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/add-hectares'

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
    it('should continue journey if valid hectare is entered', async () => {
      postOptions.payload.hectares = '1.01'
      await submitPostRequest(postOptions)
    })
    it('should show appropriate error if hectares is empty', async () => {
      postOptions.payload.hectares = ''
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter the size of the land in hectares')
    })
    it('should show appropriate error if hectares is zero', async () => {
      postOptions.payload.hectares = '0'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Size of the land must be more than 0.00 hectares')
    })
    it('should show appropriate error if hectares is below 0.01', async () => {
      postOptions.payload.hectares = '0.001'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Size of the land must be more than 0.00 hectares')
    })
    it('should show appropriate error if hectares is not a number', async () => {
      postOptions.payload.hectares = '3245sdfsdg'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Size of land must be a number, like 19 or 19.00')
    })
  })
})
