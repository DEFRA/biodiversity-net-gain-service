import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC

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
    it('Should continue journey to ELIGIBILITY_HMMP if yes is chosen', async () => {
      postOptions.payload.metric = 'yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_HMMP)
    })
    it('Should continue journey to ELIGIBILITY_HMMP if no is chosen', async () => {
      postOptions.payload.metric = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_HMMP)
    })
    it('Should continue journey to ELIGIBILITY_HMMP if not sure is chosen', async () => {
      postOptions.payload.metric = 'not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_HMMP)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a completed Biodiversity Metric 4.0 for the biodiversity gain site')
    })
  })
})
