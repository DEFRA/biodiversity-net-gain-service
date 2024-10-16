import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'
import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_TERMS_AND_CONDITIONS

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
      postOptions.payload.termsAndConditions = 'true'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    })
    it('Should stop journey if consent not ticked', async () => {
      postOptions.payload.termsAndConditions = undefined
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Check the box to confirm you have read the terms and conditions')
    })
  })
})
