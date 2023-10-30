import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'
const url = constants.routes.LEGAL_PARTY_ADD_START

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

    it('Should continue journey to legal party add type', async () => {
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.LEGAL_PARTY_ADD_TYPE)
    })
  })
})