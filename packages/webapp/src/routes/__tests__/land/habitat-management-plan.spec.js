import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_HMMP

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
    it('Should continue journey to ELIGIBILITY_RESULTS if yes is chosen', async () => {
      postOptions.payload.hmmp = 'Yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_RESULTS)
    })
    it('Should continue journey to ELIGIBILITY_RESULTS if no is chosen', async () => {
      postOptions.payload.hmmp = 'No'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_RESULTS)
    })
    it('Should continue journey to ELIGIBILITY_RESULTS if not sure is chosen', async () => {
      postOptions.payload.hmmp = 'Not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_RESULTS)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a habitat management and monitoring plan for the biodiversity gain site')
    })
  })
})
