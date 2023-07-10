import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.LANDOWNER_CONSENT

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
    it('Should continue journey to consent being ticked', async () => {
      postOptions.payload.landownerConsent = 'true'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(constants.routes.CHECK_OWNERSHIP_DETAILS)
    })
    it('Should stop journey if consent not ticked', async () => {
      postOptions.payload.landownerConsent = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Agree to the landowner consent declaration to continue')
    })
  })
})
