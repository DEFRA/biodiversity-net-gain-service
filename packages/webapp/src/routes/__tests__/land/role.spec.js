import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants'
const url = constants.routes.ROLE

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
    it('Should continue journey if role selected', async () => {
      postOptions.payload.role = 'Ecologist'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual('/land/email')
    })
    it('Should fail journey if no role selected', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select the role')
    })
    it('Should fail journey if Other role selected but no other role entered', async () => {
      postOptions.payload.role = 'Other'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Other type of role cannot be left blank')
    })
  })
})
