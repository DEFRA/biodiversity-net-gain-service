import constants from '../../../utils/constants.js'

import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = constants.routes.LANDOWNER_CONSENT

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url.substring(1)} view`, async () => {
      const res = await submitGetRequest({ url })
      expect(res.payload).toContain('I confirm that I, <strong>John Smith</strong> , am authorised to act on behalf of the landowners.')
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
      expect(res.headers.location).toEqual(constants.routes.LAND_OWNERSHIP_PROOF_LIST)
    })
    it('Should stop journey if consent not ticked', async () => {
      postOptions.payload.landownerConsent = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Agree to the landowner consent declaration to continue')
      expect(res.payload).toContain('I confirm that I, <strong>John Smith</strong> , am authorised to act on behalf of the landowners.')
    })
  })
})
