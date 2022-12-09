import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ELIGIBILITY_LEGAL_AGREEMENT

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
    it('Should continue journey to ELIGIBILITY_OWNERSHIP_PROOF if yes is chosen', async () => {
      postOptions.payload.legalAgreement = 'Yes'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_OWNERSHIP_PROOF)
    })
    it('Should continue journey to ELIGIBILITY_OWNERSHIP_PROOF if no is chosen', async () => {
      postOptions.payload.legalAgreement = 'No'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_OWNERSHIP_PROOF)
    })
    it('Should continue journey to ELIGIBILITY_OWNERSHIP_PROOF if not sure is chosen', async () => {
      postOptions.payload.legalAgreement = 'Not sure'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.ELIGIBILITY_OWNERSHIP_PROOF)
    })
    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you have a legal agreement securing the biodiversity gain site')
    })
  })
})
