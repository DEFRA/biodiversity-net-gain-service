import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_SITE_IN_ENGLAND

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
    it('Should continue journey to ELGIBILITY_CONSENT if yes is chosen', async () => {
      postOptions.payload.inEngland = 'yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_CONSENT)
    })
    it('Should continue journey to ELIGIBILITY_CANNOT_CONTINUE if no is chosen', async () => {
      postOptions.payload.inEngland = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_CANNOT_CONTINUE)
    })
    it('Should continue journey to ELIGIBILITY_CANNOT_CONTINUE if not sure is chosen', async () => {
      postOptions.payload.inEngland = 'not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_CANNOT_CONTINUE)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if the biodiversity gain site is in England')
    })
  })
})
