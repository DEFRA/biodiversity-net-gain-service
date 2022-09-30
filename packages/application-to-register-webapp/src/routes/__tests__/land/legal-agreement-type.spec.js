import constants from '../../../utils/constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = '/land/legal-agreement-type'

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const response = await submitGetRequest({ url })
      expect(response.statusCode).toBe(200)
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
    it('should allow the choice of conservation covenant legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'Conservation covenant'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should allow the choice of Planning obligation (section 106 agreement) legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'Planning obligation (section 106 agreement)'
      const response = await submitPostRequest(postOptions)
      expect(response.statusCode).toBe(302)
    })

    it('should allow the choice of I do not have a legal agreement legal agreement', async () => {
      postOptions.payload.legalAgrementType = 'I do not have a legal agreement'
      const response = await submitPostRequest(postOptions, 200)
      expect(response.statusCode).toBe(200)
    })

    it('should detect an invalid response from user', async () => {
      await submitPostRequest(postOptions, 200)
    })
  })
})
