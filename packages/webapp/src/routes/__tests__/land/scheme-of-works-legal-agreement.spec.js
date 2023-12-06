import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.SCHEME_OF_WORKS_LEGAL_AGREEMENT

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
    it('Should continue journey to NEED_ADD_ALL_PLANNING_AUTHORITIES if yes is chosen', async () => {
      postOptions.payload.schemeOfWorksLegalAgreement = 'yes-included'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
    })

    it('Should continue journey to UPLOAD_SCHEME_OF_WORKS if yes is chosen', async () => {
      postOptions.payload.schemeOfWorksLegalAgreement = 'yes-separate'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.UPLOAD_SCHEME_OF_WORKS)
    })

    it('Should continue journey to NEED_ADD_ALL_PLANNING_AUTHORITIES if no is chosen', async () => {
      postOptions.payload.schemeOfWorksLegalAgreement = 'no'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.NEED_ADD_ALL_PLANNING_AUTHORITIES)
    })

    it('Should fail journey if no answer', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select whether the planning obligation refers to a scheme of works')
    })
  })
})
