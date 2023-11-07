import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import constants from '../../../utils/constants.js'

const url = constants.routes.CHECK_DEFRA_ACCOUNT_DETAILS

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
    it('Should continue the journey when Defra account details are confirmed', async () => {
      postOptions.payload.defraAccountDetailsConfirmed = 'true'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.IS_ADDRESS_UK)
    })
    it('Should stop the journey when Defra account details are unconfirmed', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('You must confirm your Defra account details are up to date')
    })
  })
})