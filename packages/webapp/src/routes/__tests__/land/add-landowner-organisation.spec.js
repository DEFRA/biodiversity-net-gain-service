import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.ADD_LANDOWNER_ORGANISATION

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
    it('Should continue journey if org name is provided', async () => {
      postOptions.payload.organisationName = 'ABC Organisation'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LEGAL_AGREEMENT_LPA_LIST)
    })
    it('Should fail journey if no org name is provided', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Organisation name must be 2 characters or more')
    })
  })
})
