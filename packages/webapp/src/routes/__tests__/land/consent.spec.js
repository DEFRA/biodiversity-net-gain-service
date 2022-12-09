import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_CONSENT

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
    it('Should continue journey to ELIGIBILITY_LEGAL_AGREEMENT if yes is chosen', async () => {
      postOptions.payload.consent = 'Yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_LEGAL_AGREEMENT)
    })
    it('Should continue journey to ELIGIBILITY_LEGAL_AGREEMENT if no is chosen', async () => {
      postOptions.payload.consent = 'No'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_LEGAL_AGREEMENT)
    })
    it('Should continue journey to ELIGIBILITY_LEGAL_AGREEMENT if not sure is chosen', async () => {
      postOptions.payload.consent = 'Not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_LEGAL_AGREEMENT)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have consent to register the biodiversity gain site')
    })
  })
})
