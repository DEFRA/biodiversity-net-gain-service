import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_SELECTION

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

    it('Should continue journey if at least one credit is entered', async () => {
      postOptions.payload.a2 = '1.2'
      const res = await submitPostRequest(postOptions)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CREDITS_COST)
    })

    it('Should fail journey if no credits are entered', async () => {
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if more than two decimal places entered for a credit', async () => {
      postOptions.payload.a2 = '1.22222'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })

    it('Should fail journey if credit entered is not a number', async () => {
      postOptions.payload.a2 = 'geoff'
      const res = await submitPostRequest(postOptions, 200)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Enter at least one credit from the metric up to 2 decimal places, like 23.75')
    })
  })
})
