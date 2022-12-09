import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_BOUNDARY

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
    it('Should continue journey to ELIGIBILITY_BIODIVERSITY_METRIC if yes is chosen', async () => {
      postOptions.payload.boundary = 'Yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC)
    })
    it('Should continue journey to ELIGIBILITY_BIODIVERSITY_METRIC if no is chosen', async () => {
      postOptions.payload.boundary = 'No'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC)
    })
    it('Should continue journey to ELIGIBILITY_BIODIVERSITY_METRIC if not sure is chosen', async () => {
      postOptions.payload.boundary = 'Not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_BIODIVERSITY_METRIC)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a file that shows the boundary of the biodiversity gain site')
    })
  })
})
