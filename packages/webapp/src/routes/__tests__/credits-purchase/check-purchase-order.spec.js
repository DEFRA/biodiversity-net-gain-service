import { submitGetRequest, submitPostRequest } from '../helpers/server.js'
import creditsPurchaseConstants from '../../../utils/credits-purchase-constants.js'

const url = creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER

describe(url, () => {
  describe('GET', () => {
    it(`should render the ${url} view`, async () => {
      const res = await submitGetRequest({ url })
      expect(res.statusCode).toBe(200)
    })

    it('should render the view with the correct error message when no option is selected', async () => {
      const sessionData = {
        purchaseOrderErrors: {
          err: [
            {
              text: 'Select yes if you will be using a purchase order',
              href: '#purchaseOrderUsedYes'
            }
          ],
          purchaseOrderUsed: {}
        }
      }

      const res = await submitGetRequest({ url }, 200, sessionData)
      expect(res.payload).toContain('There is a problem')
      expect(res.payload).toContain('Select yes if you will be using a purchase order')
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

    it('should store purchase order details if option is selected', async () => {
      postOptions.payload = { purchaseOrderUsed: 'yes', purchaseOrderNumber: 'Test123' }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    })

    it('should redirect back if no option is selected', async () => {
      postOptions.payload = { purchaseOrderUsed: undefined }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER)
    })

    it('should redirect to the same page if `Yes` is selected and purchase order number is missing', async () => {
      postOptions.payload = { purchaseOrderUsed: 'yes', purchaseOrderNumber: '' }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_CHECK_PURCHASE_ORDER)
    })

    it('should navigate to next page if `No` is selected', async () => {
      postOptions.payload = { purchaseOrderUsed: 'no' }
      const res = await submitPostRequest(postOptions, 302)
      expect(res.headers.location).toEqual(creditsPurchaseConstants.routes.CREDITS_PURCHASE_TASK_LIST)
    })
  })
})
